import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Eye, Download, Trash2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface Image {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  fileName: string;
  uploadedAt: any;
  fileSize: number;
  fileType: string;
}

interface Genre {
  id: string;
  name: string;
  description?: string;
}

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadImages();
    loadGenres();
  }, []);

  const loadImages = async () => {
    try {
      const imagesRef = collection(db, 'images');
      const q = query(imagesRef, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      const loadedImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Image[];
      setImages(loadedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      const genresRef = collection(db, 'genres');
      const snapshot = await getDocs(genresRef);
      const loadedGenres = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Genre[];
      setGenres(loadedGenres);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const deleteImage = async (image: Image) => {
    if (!confirm(`Are you sure you want to delete "${image.title}"?`)) return;

    setDeletingImages(prev => new Set(prev).add(image.id));

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'images', image.id));

      // Delete from Storage
      const storageRef = ref(storage, `gallery/${image.category}/${image.fileName}`);
      await deleteObject(storageRef);

      // Update local state
      setImages(prev => prev.filter(img => img.id !== image.id));
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setDeletingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(image.id);
        return newSet;
      });
    }
  };

  const downloadImage = async (image: Image) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: any) => {
    if (!date) return 'Unknown';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Gallery</h2>
          <p className="text-gray-600">View and manage all uploaded images</p>
        </div>
        <div className="text-sm text-gray-500">
          {images.length} total images
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="text-sm text-gray-600">
          Showing {filteredImages.length} of {images.length} images
        </div>
      </div>

      {/* Images Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative group">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={() => window.open(image.url, '_blank')}
                      className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => downloadImage(image)}
                      className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteImage(image)}
                      disabled={deletingImages.has(image.id)}
                      className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Loading Overlay */}
                {deletingImages.has(image.id) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{image.category}</span>
                  <span>{formatFileSize(image.fileSize)}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(image.uploadedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No images have been uploaded yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminGallery; 