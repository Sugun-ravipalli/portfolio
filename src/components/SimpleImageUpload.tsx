import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase-de';
import toast from 'react-hot-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
}

interface SimpleImageUploadProps {
  onUploadSuccess?: () => void;
  onClose?: () => void;
}

const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({ onUploadSuccess, onClose }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      description: ''
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  const updateFile = (id: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, ...updates } : file
      )
    );
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    setIsUploading(true);

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        console.log(`Uploading file ${i + 1}/${uploadedFiles.length}:`, file.title);
        
        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const storageRef = ref(storage, `gallery/photography/${fileName}`);

        console.log('Uploading to Firebase Storage:', `gallery/photography/${fileName}`);
        
        // Upload to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file.file);
        console.log('File uploaded to Storage successfully:', snapshot.ref.fullPath);

        // Get download URL
        console.log('Getting download URL...');
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL obtained:', downloadURL);

        // Prepare Firestore document
        const imageData = {
          title: file.title,
          description: file.description || '',
          category: 'photography', // Default category
          url: downloadURL,
          fileName: fileName,
          uploadedAt: new Date(),
          fileSize: file.file.size,
          fileType: file.file.type
        };

        console.log('Saving to Firestore:', imageData);

        // Save to Firestore
        const docRef = await addDoc(collection(db, 'images'), imageData);
        console.log('Document saved to Firestore with ID:', docRef.id);
      }

      console.log('All uploads completed successfully');
      toast.success(`${uploadedFiles.length} image(s) uploaded successfully!`);
      
      // Clean up preview URLs
      uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
      setUploadedFiles([]);
      
      // Call the success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Upload error details:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          toast.error('Upload failed: Unauthorized access to Firebase Storage');
        } else if (error.message.includes('storage/quota-exceeded')) {
          toast.error('Upload failed: Storage quota exceeded');
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
      } else {
        toast.error('Upload failed: Unknown error occurred');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </h3>
        <p className="text-gray-600 mb-4">
          or click to select files (JPEG, PNG, GIF, WebP)
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Choose Files
        </button>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Selected Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="bg-white border rounded-lg p-4 space-y-3">
                {/* Image Preview */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={file.preview}
                    alt={file.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={file.title}
                    onChange={(e) => updateFile(file.id, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Image title"
                  />
                  <textarea
                    value={file.description}
                    onChange={(e) => updateFile(file.id, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Image description (optional)"
                    rows={3}
                  />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {uploadedFiles.length > 0 && (
        <div className="flex justify-end space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Uploading...' : `Upload ${uploadedFiles.length} Image${uploadedFiles.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleImageUpload;

