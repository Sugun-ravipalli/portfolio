import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase-de';
import { Eye, Download, Trash2, Heart, Share2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface Image {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  uploadedAt: any;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

interface ImageCardProps {
  image: Image;
  isAdmin: boolean;
  onDelete: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, isAdmin, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'images', image.id));
      
      // Delete from Storage if fileName exists
      if (image.fileName) {
        const storageRef = ref(storage, `gallery/${image.category}/${image.fileName}`);
        await deleteObject(storageRef);
      }
      
      toast.success('Image deleted successfully!');
      onDelete();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: image.description || 'Check out this beautiful photo!',
        url: image.url,
      });
    } else {
      navigator.clipboard.writeText(image.url);
      toast.success('Image URL copied to clipboard!');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'Unknown date';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
            }}
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => setShowFullImage(true)}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                title="View full size"
              >
                <Eye className="h-4 w-4 text-gray-700" />
              </button>
              
              <button
                onClick={handleDownload}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                title="Download"
              >
                <Download className="h-4 w-4 text-gray-700" />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                title="Share"
              >
                <Share2 className="h-4 w-4 text-gray-700" />
              </button>
              
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
          </div>
          
          {/* Like button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
          >
            <Heart 
              className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
            />
          </button>
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {image.category}
            </span>
          </div>
        </div>
        
        {/* Image Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {image.title}
          </h3>
          
          {image.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {image.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(image.uploadedAt)}</span>
            </div>
            
            {image.fileSize && (
              <span>{formatFileSize(image.fileSize)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={image.url}
              alt={image.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                title="Download"
              >
                <Download className="h-4 w-4 text-gray-700" />
              </button>
              
              <button
                onClick={() => setShowFullImage(false)}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                title="Close"
              >
                <span className="text-gray-700 font-bold">×</span>
              </button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <h3 className="font-semibold mb-1">{image.title}</h3>
              {image.description && (
                <p className="text-sm text-gray-300 mb-2">{image.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Category: {image.category}</span>
                <span>{formatDate(image.uploadedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard; 