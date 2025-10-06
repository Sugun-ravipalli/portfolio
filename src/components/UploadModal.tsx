import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase-de';
import { X, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadModalProps {
  category: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  title: string;
  description: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ category, onClose, onSuccess }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ""),
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

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const file = prev[index];
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateFile = (index: number, field: keyof UploadedFile, value: string) => {
    setUploadedFiles(prev => 
      prev.map((file, i) => 
        i === index ? { ...file, [field]: value } : file
      )
    );
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    setIsUploading(true);
    console.log('Starting upload process for', uploadedFiles.length, 'files');

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        console.log(`Uploading file ${i + 1}/${uploadedFiles.length}:`, file.title);
        
        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const storageRef = ref(storage, `gallery/${category}/${fileName}`);

        console.log('Uploading to Firebase Storage:', `gallery/${category}/${fileName}`);
        
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
          category: category,
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
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Upload error details:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          toast.error('Upload failed: Unauthorized access to Firebase Storage');
        } else if (error.message.includes('storage/quota-exceeded')) {
          toast.error('Upload failed: Storage quota exceeded');
        } else if (error.message.includes('firestore/permission-denied')) {
          toast.error('Upload failed: Permission denied to write to database');
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
      } else {
        toast.error('Failed to upload images. Please try again.');
      }
    } finally {
      console.log('Upload process finished, setting isUploading to false');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload to {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-primary-600 font-medium">Drop the images here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop images here, or <span className="text-primary-600">click to select</span>
                </p>
                <p className="text-sm text-gray-500">
                  Supports: JPG, PNG, GIF, WebP (Max 10MB each)
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-4">
                Selected Images ({uploadedFiles.length})
              </h3>
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={file.preview}
                      alt={file.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={file.title}
                        onChange={(e) => updateFile(index, 'title', e.target.value)}
                        placeholder="Image title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <textarea
                        value={file.description}
                        onChange={(e) => updateFile(index, 'description', e.target.value)}
                        placeholder="Image description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || uploadedFiles.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Upload {uploadedFiles.length} Image(s)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal; 