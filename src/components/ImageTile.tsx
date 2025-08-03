import React, { useState, useRef } from 'react';
import { Eye, Download, Trash2, Edit3, Share2, Calendar, Tag, FileText } from 'lucide-react';
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
  order?: number;
}

interface ImageTileProps {
  image: Image;
  isSelected: boolean;
  onSelect: (imageId: string, selected: boolean) => void;
  onClick?: (image: Image) => void;
  isAdmin: boolean;
  viewMode: 'grid' | 'list';
  index: number;
  isReordering: boolean;
}

const ImageTile: React.FC<ImageTileProps> = ({
  image,
  isSelected,
  onSelect,
  onClick,
  isAdmin,
  viewMode,
  index,
  isReordering
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(image.title);
  const [isLoading, setIsLoading] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editedTitle.trim() === '') {
      toast.error('Title cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      // Update in Firestore
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      
      const imageRef = doc(db, 'images', image.id);
      await updateDoc(imageRef, { title: editedTitle.trim() });
      
      setIsEditing(false);
      toast.success('Title updated successfully!');
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Failed to update title');
      setEditedTitle(image.title); // Reset to original
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(image.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleTileClick = (e: React.MouseEvent) => {
    // Don't trigger click if clicking on checkbox or action buttons
    if ((e.target as HTMLElement).closest('.action-button') || 
        (e.target as HTMLElement).closest('.checkbox-container')) {
      return;
    }
    
    if (onClick) {
      onClick(image);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(image.id, e.target.checked);
  };

  if (viewMode === 'list') {
    return (
      <div 
        ref={tileRef}
        className={`
          relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer
          ${isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-lg' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }
          ${isReordering ? 'cursor-move' : ''}
        `}
        onClick={handleTileClick}
      >
        <div className="flex items-center space-x-4 p-4">
          {/* Checkbox */}
          {isAdmin && (
            <div className="checkbox-container flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          )}

          {/* Image */}
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Image+Not+Found';
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={isLoading}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-600 truncate mt-1">{image.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span className="capitalize">{image.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(image.uploadedAt)}</span>
                  </div>
                  {image.fileSize && (
                    <div className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>{formatFileSize(image.fileSize)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="action-button p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleShare}
              className="action-button p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={handleEdit}
                  className="action-button p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      ref={tileRef}
      className={`
        group relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-blue-500 shadow-lg transform scale-[1.02]' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
        }
        ${isReordering ? 'cursor-move' : ''}
      `}
      onClick={handleTileClick}
    >
      {/* Checkbox overlay */}
      {isAdmin && (
        <div className="absolute top-3 left-3 z-10 checkbox-container">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white shadow-sm"
          />
        </div>
      )}

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
        
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded-full">
            {image.category}
          </span>
        </div>
        
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(image);
              }}
              className="action-button p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              title="View full size"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="action-button p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              title="Download"
            >
              <Download className="h-5 w-5 text-gray-700" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="action-button p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              title="Share"
            >
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>

            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="action-button p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                title="Edit"
              >
                <Edit3 className="h-5 w-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Image Info */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ImageTile; 