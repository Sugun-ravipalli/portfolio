import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  category: string;
  title: string;
}

const UploadForm: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = [
    'birthdays',
    'housewarmings',
    'pre-wedding',
    'events'
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      category: 'birthdays',
      title: file.name.replace(/\.[^/.]+$/, '')
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

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically upload to Firebase Storage or Cloudinary
      console.log('Uploading files:', uploadedFiles);
      
      setUploadSuccess(true);
      setUploadedFiles([]);
      
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-dark-300 hover:border-primary-400 hover:bg-dark-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-dark-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-800 mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </h3>
        <p className="text-dark-600 mb-4">
          or click to select files (JPEG, PNG, GIF, WebP)
        </p>
        <button className="btn-primary">
          Choose Files
        </button>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-dark-800">
              Uploaded Images ({uploadedFiles.length})
            </h3>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 space-y-4">
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={file.preview}
                    alt={file.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* File Details */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={file.title}
                      onChange={(e) => updateFile(file.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                      Category
                    </label>
                    <select
                      value={file.category}
                      onChange={(e) => updateFile(file.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-sm text-dark-600">
                    <p>Size: {(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Type: {file.file.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <CheckCircle className="h-5 w-5" />
          <span>Images uploaded successfully!</span>
        </div>
      )}
    </div>
  );
};

export default UploadForm; 