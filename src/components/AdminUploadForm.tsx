import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { storage, db, auth } from '../config/firebase-de';
import ImageCropper from './ImageCropper';
import toast from 'react-hot-toast';
import { Upload, X, Plus, Trash2, Edit, FolderOpen, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [newGenre, setNewGenre] = useState({ name: '', description: '' });
  const [uploadStep, setUploadStep] = useState<'category' | 'upload' | 'review'>('category');

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
      toast.error('Please enter a category name');
      return;
    }

    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('You must be logged in to add categories.');
      return;
    }

    console.log('Current user:', currentUser.email);
    console.log('Attempting to add category:', newGenre.name.trim());

    try {
      const docRef = await addDoc(collection(db, 'genres'), {
        name: newGenre.name.trim(),
        description: newGenre.description.trim(),
        createdBy: currentUser.uid,
        createdAt: new Date()
      });
      
      console.log('Category added successfully with ID:', docRef.id);
      
      setGenres(prev => [...prev, { id: docRef.id, ...newGenre }]);
      setNewGenre({ name: '', description: '' });
      toast.success('Category added successfully!');
    } catch (error: any) {
      console.error('Error adding genre:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // More specific error messages
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check if you are logged in as admin.');
      } else if (error.code === 'unavailable') {
        toast.error('Firebase is temporarily unavailable. Please try again.');
      } else if (error.code === 'unauthenticated') {
        toast.error('You must be logged in to add categories.');
      } else {
        toast.error(`Failed to add category: ${error.message}`);
      }
    }
  };

  const deleteGenre = async (genreId: string) => {
    try {
      await deleteDoc(doc(db, 'genres', genreId));
      setGenres(prev => prev.filter(g => g.id !== genreId));
      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting genre:', error);
      toast.error('Failed to delete category');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: ''
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setUploadStep('review');
  }, [selectedCategory]);

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

    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    setIsUploading(true);
    console.log('Starting upload process for', uploadedFiles.length, 'files to category:', selectedCategory);

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        console.log(`Uploading file ${i + 1}/${uploadedFiles.length}:`, file.title);
        
        const fileToUpload = file.croppedBlob || file.file;
        
        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const storageRef = ref(storage, `gallery/${selectedCategory.toLowerCase().replace(/\s+/g, '-')}/${fileName}`);

        console.log('Uploading to Firebase Storage:', `gallery/${selectedCategory.toLowerCase().replace(/\s+/g, '-')}/${fileName}`);
        
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
          category: selectedCategory,
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
      toast.success(`${uploadedFiles.length} image(s) uploaded successfully to ${selectedCategory}!`);
      setUploadedFiles([]);
      setUploadStep('category');
    } catch (error) {
      console.error('Upload error details:', error);
      
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

  const resetUpload = () => {
    setUploadedFiles([]);
    setSelectedCategory('');
    setUploadStep('category');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Step Indicator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center space-x-8">
          <div className={`flex items-center space-x-2 ${uploadStep === 'category' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-medium">Select Category</span>
          </div>
          <div className={`flex items-center space-x-2 ${uploadStep === 'upload' || uploadStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep === 'upload' || uploadStep === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-medium">Upload Images</span>
          </div>
          <div className={`flex items-center space-x-2 ${uploadStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="font-medium">Review & Upload</span>
          </div>
        </div>
      </div>

      {/* Step 1: Category Selection */}
      {uploadStep === 'category' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Step 1: Select Category</h3>
          
          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => {
                  setSelectedCategory(genre.name);
                  setUploadStep('upload');
                }}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">{genre.name}</h4>
                    {genre.description && (
                      <p className="text-sm text-gray-500">{genre.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

                     {/* Add New Category */}
           <div className="border-t pt-6">
             <h4 className="font-medium text-gray-900 mb-4">Add New Category</h4>
             <div className="flex gap-4">
               <input
                 type="text"
                 placeholder="Category name"
                 value={newGenre.name}
                 onChange={(e) => setNewGenre(prev => ({ ...prev, name: e.target.value }))}
                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
               <input
                 type="text"
                 placeholder="Description (optional)"
                 value={newGenre.description}
                 onChange={(e) => setNewGenre(prev => ({ ...prev, description: e.target.value }))}
                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
               <button
                 onClick={addGenre}
                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
               >
                 Add
               </button>
             </div>
             
                           {/* Debug Info */}
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Debug Info:</p>
                <p className="text-xs text-gray-500">
                  User: {auth.currentUser?.email || 'Not logged in'}
                </p>
                <p className="text-xs text-gray-500">
                  Auth Status: {auth.currentUser ? 'Authenticated' : 'Not authenticated'}
                </p>
                <p className="text-xs text-gray-500">
                  User ID: {auth.currentUser?.uid || 'No UID'}
                </p>
                <button
                  onClick={() => {
                    console.log('Current user:', auth.currentUser);
                    console.log('Auth state:', auth.currentUser ? 'Logged in' : 'Not logged in');
                    console.log('User email:', auth.currentUser?.email);
                    console.log('User UID:', auth.currentUser?.uid);
                    toast.success('Check browser console for debug info');
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  Check Auth Status
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Step 2: Upload Images */}
      {uploadStep === 'upload' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Step 2: Upload Images to {selectedCategory}
            </h3>
            <button
              onClick={() => setUploadStep('category')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Change Category
            </button>
          </div>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium text-lg">Drop the images here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2 text-lg">
                  Drag & drop images here, or <span className="text-blue-600 font-medium">click to select</span>
                </p>
                <p className="text-sm text-gray-500">
                  Supports: JPG, PNG, GIF, WebP (Max 10MB each)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Review and Upload */}
      {uploadStep === 'review' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Step 3: Review & Upload ({uploadedFiles.length} images)
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setUploadStep('upload')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Add More Images
              </button>
              <button
                onClick={resetUpload}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Start Over
              </button>
            </div>
          </div>

          {/* Uploaded Files */}
          <div className="space-y-4 mb-6">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border">
                <img
                  src={file.preview}
                  alt={file.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={file.title}
                    onChange={(e) => updateFile(file.id, 'title', e.target.value)}
                    placeholder="Image title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={file.description}
                    onChange={(e) => updateFile(file.id, 'description', e.target.value)}
                    placeholder="Image description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={resetUpload}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
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
      )}

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