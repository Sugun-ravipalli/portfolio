import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Edit3, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
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

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image | null;
  images?: Image[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
  isAdmin?: boolean;
  onEdit?: (image: Image) => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  image,
  images = [],
  currentIndex = 0,
  onNavigate,
  isAdmin = false,
  onEdit
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, image]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (onNavigate && currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (onNavigate && currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
        case '+':
        case '=':
          e.preventDefault();
          setScale(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          e.preventDefault();
          setScale(prev => Math.max(prev - 0.25, 0.25));
          break;
        case '0':
          setScale(1);
          setRotation(0);
          setPosition({ x: 0, y: 0 });
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onNavigate, onClose]);

  const handleDownload = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  const handleShare = () => {
    if (!image) return;
    
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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate?.(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => onNavigate?.(currentIndex + 1)}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image container - Auto-fit to screen */}
      <div 
        className="relative flex-1 flex items-center justify-center p-8 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={image.url}
          alt={image.title}
          className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain transition-transform duration-200"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
        />
      </div>

      {/* Controls toolbar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-2 bg-black bg-opacity-50 rounded-full px-4 py-2">
        <button
          onClick={handleZoomOut}
          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          title="Zoom Out (Ctrl + -)"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        
        <span className="text-white text-sm px-2">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={handleZoomIn}
          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          title="Zoom In (Ctrl + +)"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        
        <button
          onClick={handleRotate}
          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          title="Rotate"
        >
          <RotateCw className="h-5 w-5" />
        </button>
        
        <button
          onClick={handleReset}
          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          title="Reset (0)"
        >
          <span className="text-sm font-bold">0</span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <button
          onClick={handleDownload}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
          title="Download"
        >
          <Download className="h-5 w-5" />
        </button>
        
        <button
          onClick={handleShare}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
        
        {isAdmin && onEdit && (
          <button
            onClick={() => onEdit(image)}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            title="Edit"
          >
            <Edit3 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Image counter (only if multiple images) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
          {currentIndex + 1} of {images.length}
        </div>
      )}

      {/* Clean interface - no keyboard hints */}
    </div>
  );
};

export default ImageViewerModal; 