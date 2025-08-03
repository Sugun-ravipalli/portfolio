import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import ImageCropper from './ImageCropper';
import toast from 'react-hot-toast';
import { Upload, X, Plus, Trash2, Edit } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  category: string;
  title: string;
  description: string;
  croppedBlob?: Blob;
}

interface Genre {
  id: string;
  name: string;
  description?: string;
}

const AdminUploadForm: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [newGenre, setNewGenre] = useState({ name: '', description: '' });

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const genresRef = collection(db, 'genres');
      const snapshot = await getDocs(genresRef);
      
      if (snapshot.empty) {
        // Initialize with default genres
        const defaultGenres = [
          { name: 'Birthdays', description: 'Birthday celebrations and parties' },
          { name: 'Pre-Wedding', description: 'Pre-wedding photo sessions' },
          { name: 'Housewarming', description: 'Housewarming events' },
          { name: 'Events', description: 'Corporate and social events' },
          { name: 'Portraits', description: 'Individual and family portraits' },
          { name: 'Wedding', description: 'Wedding ceremonies and receptions' }
        ];
        
        for (const genre of defaultGenres) {
          await addDoc(collection(db, 'genres'), genre);
        }
        setGenres(defaultGenres.map((g, i) => ({ id: `default-${i}`, ...g })));
      } else {
        const loadedGenres = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Genre[];
        setGenres(loadedGenres);
      }
    } catch (error) {
      console.error('Error loading genres:', error);
      // Fallback to default genres
      setGenres([
        { id: 'birthdays', name: 'Birthdays', description: 'Birthday celebrations' },
        { id: 'pre-wedding', name: 'Pre-Wedding', description: 'Pre-wedding sessions' },
        { id: 'housewarming', name: 'Housewarming', description: 'Housewarming events' },
        { id: 'events', name: 'Events', description: 'Corporate events' }
      ]);
    }
  };

  const addGenre = async () => {
    if (!newGenre.name.trim()) {
      toast.error('Please enter a genre name');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'genres'), {
        name: newGenre.name.trim(),
        description: newGenre.description.trim()
      });
      
      setGenres(prev => [...prev, { id: docRef.id, ...newGenre }]);
      setNewGenre({ name: '', description: '' });
      toast.success('Genre added successfully!');
    } catch (error) {
      console.error('Error adding genre:', error);
      toast.error('Failed to add genre');
    }
  };

  const deleteGenre = async (genreId: string) => {
    try {
      await deleteDoc(doc(db, 'genres', genreId));
      setGenres(prev => prev.filter(g => g.id !== genreId));
      toast.success('Genre deleted successfully!');
    } catch (error) {
      console.error('Error deleting genre:', error);
      toast.error('Failed to delete genre');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      category: genres.length > 0 ? genres[0].name.toLowerCase().replace(/\s+/g, '-') : 'events',
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: ''
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, [genres]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const updateFile = (id: string, field: keyof UploadedFile, value: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, [field]: value } : file
      )
    );
  };

  const openCropper = (file: UploadedFile) => {
    setCurrentFile(file);
    setShowCropper(true);
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    if (currentFile) {
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === currentFile.id ? { ...file, croppedBlob } : file
        )
      );
      setShowCropper(false);
      setCurrentFile(null);
      toast.success('Image cropped successfully!');
    }
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
        
        const fileToUpload = file.croppedBlob || file.file;
        
        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const storageRef = ref(storage, `gallery/${file.category}/${fileName}`);

        console.log('Uploading to Firebase Storage:', `gallery/${file.category}/${fileName}`);
        
        // Upload to Firebase Storage
        const snapshot = await uploadBytes(storageRef, fileToUpload);
        console.log('File uploaded to Storage successfully:', snapshot.ref.fullPath);

        // Get download URL
        console.log('Getting download URL...');
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL obtained:', downloadURL);

        // Prepare Firestore document
        const imageData = {
          title: file.title,
          description: file.description || '',
          category: file.category,
          url: downloadURL,
          fileName: fileName,
          uploadedAt: new Date(),
          fileSize: fileToUpload.size,
          fileType: fileToUpload.type
        };

        console.log('Saving to Firestore:', imageData);

        // Save to Firestore
        const docRef = await addDoc(collection(db, 'images'), imageData);
        console.log('Document saved to Firestore with ID:', docRef.id);
      }

      console.log('All uploads completed successfully');
      toast.success(`${uploadedFiles.length} image(s) uploaded successfully!`);
      setUploadedFiles([]);
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
    <div className="p-6 space-y-8">
      {/* Genre Management */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Categories</h3>
        
        {/* Add New Genre */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Category name"
            value={newGenre.name}
            onChange={(e) => setNewGenre(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newGenre.description}
            onChange={(e) => setNewGenre(prev => ({ ...prev, description: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={addGenre}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Add Category
          </button>
        </div>

        {/* Existing Genres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div>
                <h4 className="font-medium text-gray-900">{genre.name}</h4>
                {genre.description && (
                  <p className="text-sm text-gray-500">{genre.description}</p>
                )}
              </div>
              <button
                onClick={() => deleteGenre(genre.id)}
                className="p-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h3>
        
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
            <h4 className="font-medium text-gray-900 mb-4">
              Selected Images ({uploadedFiles.length})
            </h4>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                  <img
                    src={file.preview}
                    alt={file.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={file.title}
                      onChange={(e) => updateFile(file.id, 'title', e.target.value)}
                      placeholder="Image title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <textarea
                      value={file.description}
                      onChange={(e) => updateFile(file.id, 'description', e.target.value)}
                      placeholder="Image description (optional)"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                      value={file.category}
                      onChange={(e) => updateFile(file.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.name.toLowerCase().replace(/\s+/g, '-')}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => openCropper(file)}
                      className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Crop Image"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  `Upload ${uploadedFiles.length} Image(s)`
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {showCropper && currentFile && (
        <ImageCropper
          imageSrc={currentFile.preview}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setCurrentFile(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUploadForm; 