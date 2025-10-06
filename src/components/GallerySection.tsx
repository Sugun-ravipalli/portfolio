import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase-de';
import ImageCard from './ImageCard';
import UploadModal from './UploadModal';
import { Plus, RefreshCw, Eye, Image as ImageIcon } from 'lucide-react';
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

interface GallerySectionProps {
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isAdmin: boolean;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  category,
  title,
  description,
  icon: Icon,
  isAdmin
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    loadImages();
    
    // Set up real-time listener for this category (simplified query to avoid index requirement)
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'images'),
        where('category', '==', category)
        // Temporarily removed orderBy to avoid composite index requirement
      ),
      (snapshot) => {
        const loadedImages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Image[];
        
        // Sort locally instead of in the query
        loadedImages.sort((a, b) => {
          const dateA = a.uploadedAt?.toDate ? a.uploadedAt.toDate() : new Date(a.uploadedAt);
          const dateB = b.uploadedAt?.toDate ? b.uploadedAt.toDate() : new Date(b.uploadedAt);
          return dateB.getTime() - dateA.getTime(); // Descending order
        });
        
        setImages(loadedImages);
        setLoading(false);
        setError(null);
        setDebugInfo(`Real-time update: Found ${loadedImages.length} images for ${category}`);
      },
      (error) => {
        console.error('Real-time listener error:', error);
        setError(error.message);
        setLoading(false);
        setDebugInfo(`Error in real-time listener: ${error.message}`);
      }
    );

    return () => unsubscribe();
  }, [category]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Loading images for category: ${category}`);
      setDebugInfo(`Loading images for category: ${category}`);
      
      const imagesRef = collection(db, 'images');
      // Simplified query to avoid composite index requirement
      const q = query(
        imagesRef,
        where('category', '==', category)
        // Temporarily removed orderBy
      );
      
      const snapshot = await getDocs(q);
      const loadedImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Image[];
      
      // Sort locally instead of in the query
      loadedImages.sort((a, b) => {
        const dateA = a.uploadedAt?.toDate ? a.uploadedAt.toDate() : new Date(a.uploadedAt);
        const dateB = b.uploadedAt?.toDate ? b.uploadedAt.toDate() : new Date(b.uploadedAt);
        return dateB.getTime() - dateA.getTime(); // Descending order
      });
      
      console.log(`Found ${loadedImages.length} images for ${category}:`, loadedImages);
      setImages(loadedImages);
      setDebugInfo(`Successfully loaded ${loadedImages.length} images for ${category}`);
      
      if (loadedImages.length === 0) {
        setDebugInfo(`No images found for category: ${category}. Check if images were uploaded with correct category.`);
      }
      
    } catch (error) {
      console.error('Error loading images:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setDebugInfo(`Error loading images: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Don't fallback to sample images - show the error instead
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    toast.success('Image uploaded successfully! Gallery will update automatically.');
    // Real-time listener will handle the update
  };

  const handleRefresh = () => {
    loadImages();
    toast.success('Gallery refreshed!');
  };

  return (
    <section className="py-8 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600">{description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Eye className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">{images.length} photos</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            {isAdmin && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                <span>Add Photos</span>
              </button>
            )}
          </div>
        </div>

        {/* Debug Info (only show if there are issues) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Images</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-2">{debugInfo}</p>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> This is a temporary fix while the Firestore index is building. 
                The gallery should work normally once the index is ready.
              </p>
            </div>
          </div>
        )}

        {/* Images Grid with Enhanced Design */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading {title} photos...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                isAdmin={isAdmin}
                onDelete={loadImages}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ImageIcon className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No photos yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {isAdmin 
                ? 'Start building your gallery by uploading some beautiful photos!' 
                : 'Check back soon for amazing photos in this category.'
              }
            </p>
            
            {isAdmin && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Upload First Photo</span>
              </button>
            )}
            
            {/* Debug info for empty state */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg max-w-md mx-auto">
              <p className="text-xs text-gray-500 font-mono">{debugInfo}</p>
            </div>
          </div>
        )}

        {/* Debug Panel (only for admin) */}
        {isAdmin && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Debug Info</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Category: <span className="font-mono bg-gray-200 px-1 rounded">{category}</span></p>
              <p>Images found: <span className="font-mono bg-gray-200 px-1 rounded">{images.length}</span></p>
              <p>Status: <span className="font-mono bg-gray-200 px-1 rounded">{loading ? 'Loading' : error ? 'Error' : 'Ready'}</span></p>
              <p>Last update: <span className="font-mono bg-gray-200 px-1 rounded">{new Date().toLocaleTimeString()}</span></p>
              <p>Query: <span className="font-mono bg-gray-200 px-1 rounded">category == "{category}" (sorted locally)</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          category={category}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </section>
  );
};

export default GallerySection; 