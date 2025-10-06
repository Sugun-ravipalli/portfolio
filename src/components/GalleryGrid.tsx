import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, onSnapshot, writeBatch, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase-de';
import ImageTile from './ImageTile';
// import SelectionToolbar from './SelectionToolbar';
// import DeleteConfirmModal from './DeleteConfirmModal';
import { Filter, SortAsc, SortDesc, Grid, List, Loader2 } from 'lucide-react';
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

interface GalleryGridProps {
  category?: string;
  isAdmin: boolean;
  onImageClick?: (image: Image) => void;
}

type SortOption = 'newest' | 'oldest' | 'manual' | 'title';
type ViewMode = 'grid' | 'list';

const GalleryGrid: React.FC<GalleryGridProps> = ({ 
  category, 
  isAdmin, 
  onImageClick 
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isReordering, setIsReordering] = useState(false);
  const [internalCategory, setInternalCategory] = useState<string | null>(category || null);
  
  // Drag and drop state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);

  // Configure sensors for drag and drop
  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 8,
  //     },
  //   }),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );

  // Use the category prop directly for filtering, with internal state as fallback
  const currentCategory = category || internalCategory || 'all';

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'birthdays', name: 'Birthdays' },
    { id: 'pre-wedding', name: 'Pre-Wedding' },
    { id: 'housewarming', name: 'Housewarming' },
    { id: 'events', name: 'Events' },
    { id: 'portraits', name: 'Portraits' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'graduation', name: 'Graduation' }
  ];

  // Update internal category when prop changes
  useEffect(() => {
    setInternalCategory(category || null);
  }, [category]);

  const handleCategoryChange = (newCategory: string | null) => {
    console.log('GalleryGrid: Category changed to:', newCategory);
    setInternalCategory(newCategory);
  };

  // Load images with real-time updates
  useEffect(() => {
    const loadImages = () => {
      try {
        console.log("🔄 Loading images with filter:", currentCategory);
        setLoading(true);
        
        const imagesRef = collection(db, 'images');
        let q;
        
        // Build query based on category only (no orderBy to avoid index requirements)
        if (currentCategory && currentCategory !== 'all') {
          console.log("📂 Filtering by category:", currentCategory);
          q = query(imagesRef, where('category', '==', currentCategory));
        } else {
          console.log("📂 Loading all categories");
          q = query(imagesRef);
        }

        console.log("🔍 Executing Firestore query:", q);

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const loadedImages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Image[];

          console.log(`✅ Loaded ${loadedImages.length} images for category: ${currentCategory}`);
          
          // Log first few images for debugging
          if (loadedImages.length > 0) {
            console.log("📸 Sample images:", loadedImages.slice(0, 3).map(img => ({
              id: img.id,
              title: img.title,
              category: img.category
            })));
          }

          // Sort locally based on sortBy preference
          const sortedImages = [...loadedImages].sort((a, b) => {
            switch (sortBy) {
              case 'newest':
                return new Date(b.uploadedAt?.toDate?.() || b.uploadedAt).getTime() - 
                       new Date(a.uploadedAt?.toDate?.() || a.uploadedAt).getTime();
              case 'oldest':
                return new Date(a.uploadedAt?.toDate?.() || a.uploadedAt).getTime() - 
                       new Date(b.uploadedAt?.toDate?.() || b.uploadedAt).getTime();
              case 'title':
                return (a.title || '').localeCompare(b.title || '');
              case 'manual':
                return (a.order || 0) - (b.order || 0);
              default:
                return new Date(b.uploadedAt?.toDate?.() || b.uploadedAt).getTime() - 
                       new Date(a.uploadedAt?.toDate?.() || a.uploadedAt).getTime();
            }
          });

          setImages(sortedImages);
          setLoading(false);
        }, (error) => {
          console.error('❌ Error loading images:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            filterCategory: currentCategory,
            sortBy
          });
          
          setLoading(false);
          
          // Enhanced error handling with index creation links
          if (error.code === 'permission-denied') {
            toast.error('Permission denied. Please check your Firebase rules.');
          } else if (error.code === 'unavailable') {
            toast.error('Firebase is temporarily unavailable. Please try again.');
          } else if (error.message.includes('index') || error.code === 'failed-precondition') {
            // Extract index creation link from error message
            const indexMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
            if (indexMatch) {
              console.log('🔗 Index creation link:', indexMatch[0]);
              toast.error(
                <div>
                  <p>Database index required for this query.</p>
                  <a 
                    href={indexMatch[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Click here to create the required index
                  </a>
                </div>,
                { duration: 10000 }
              );
            } else {
              toast.error('Database index required. Please contact administrator.');
            }
          } else {
            toast.error(`Failed to load images: ${error.message}`);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('❌ Error setting up listener:', error);
        setLoading(false);
        toast.error('Failed to set up image loading');
      }
    };

    const unsubscribe = loadImages();
    return () => {
      console.log("🧹 Cleaning up image listener");
      unsubscribe?.();
    };
  }, [currentCategory, sortBy]);

  // Handle image selection
  const handleImageSelect = useCallback((imageId: string, selected: boolean) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(imageId);
      } else {
        newSet.delete(imageId);
      }
      return newSet;
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  }, [images, selectedImages.size]);

  // Handle batch delete
  const handleBatchDelete = useCallback(async () => {
    if (selectedImages.size === 0) return;

    try {
      const batch = writeBatch(db);
      const selectedImageIds = Array.from(selectedImages);
      
      // Add delete operations to batch
      selectedImageIds.forEach(imageId => {
        const imageRef = doc(db, 'images', imageId);
        batch.delete(imageRef);
      });

      await batch.commit();
      
      setSelectedImages(new Set());
      setShowDeleteModal(false);
      toast.success(`Successfully deleted ${selectedImageIds.length} image(s)`);
    } catch (error) {
      console.error('Error deleting images:', error);
      toast.error('Failed to delete images');
    }
  }, [selectedImages]);

  // Handle drag and drop reordering
  const handleReorder = useCallback(async (reorderedImages: Image[]) => {
    setIsReordering(true);
    
    try {
      const batch = writeBatch(db);
      
      reorderedImages.forEach((image, index) => {
        const imageRef = doc(db, 'images', image.id);
        batch.update(imageRef, { order: index });
      });

      await batch.commit();
      setImages(reorderedImages);
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsReordering(false);
    }
  }, []);

  // Drag and drop event handlers
  // const handleDragStart = (event: DragStartEvent) => {
  //   setActiveId(event.active.id as string);
  //   setIsDraggingEnabled(true);
  // };

  // const handleDragEnd = async (event: DragEndEvent) => {
  //   const { active, over } = event;
    
  //   setActiveId(null);
  //   setIsDraggingEnabled(false);

  //   if (active.id !== over?.id) {
  //     const oldIndex = images.findIndex(img => img.id === active.id);
  //     const newIndex = images.findIndex(img => img.id === over?.id);
      
  //     if (oldIndex !== -1 && newIndex !== -1) {
  //       const reorderedImages = arrayMove(images, oldIndex, newIndex);
  //       setImages(reorderedImages);
        
  //       // Update order in Firestore
  //       await handleReorder(reorderedImages);
  //     }
  //   }
  // };

  // const handleDragCancel = () => {
  //   setActiveId(null);
  //   setIsDraggingEnabled(false);
  // };

  // Handle image click
  const handleImageClick = useCallback((image: Image) => {
    if (onImageClick) {
      onImageClick(image);
    }
  }, [onImageClick]);

  if (loading) {
  return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Left side - Filters and sorting */}
          <div className="flex flex-wrap items-center space-x-4">
            {/* Category Filter - Now using CategoryFilter component */}
            {/* <CategoryFilter
              categories={categories.filter(c => c.id !== 'all')} // Exclude 'all' from dropdown
              selectedCategory={internalCategory}
              onCategoryChange={handleCategoryChange}
              showDropdown={true}
              showBubbles={false}
            /> */}
            
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              {sortBy === 'newest' ? (
                <SortDesc className="h-4 w-4 text-gray-500" />
              ) : (
                <SortAsc className="h-4 w-4 text-gray-500" />
              )}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="manual">Manual Order</option>
              </select>
            </div>
          </div>

          {/* Right side - View mode and select all */}
          <div className="flex items-center space-x-4">
            {/* Drag and Drop Toggle (Admin only) */}
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDraggingEnabled(!isDraggingEnabled)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDraggingEnabled
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={isDraggingEnabled ? 'Disable drag to reorder' : 'Enable drag to reorder'}
                >
                  {isDraggingEnabled ? '🔄 Reordering On' : '📋 Reordering Off'}
                  </button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            {/* Select All */}
            {isAdmin && images.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {images.length} image{images.length !== 1 ? 's' : ''} found
            {currentCategory !== 'all' && ` in ${categories.find(c => c.id === currentCategory)?.name}`}
          </p>
        </div>
      </div>

      {/* Selection Toolbar */}
      {selectedImages.size > 0 && (
        // <SelectionToolbar
        //   selectedCount={selectedImages.size}
        //   onDelete={() => setShowDeleteModal(true)}
        //   onDeselectAll={() => setSelectedImages(new Set())}
        // />
        null
      )}

      {/* Images Grid/List */}
      {images.length > 0 ? (
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }
        `}>
          {images.map((image, index) => (
            <ImageTile
              key={image.id}
              image={image}
              isSelected={selectedImages.has(image.id)}
              onSelect={handleImageSelect}
              onClick={handleImageClick}
              isAdmin={isAdmin}
              viewMode={viewMode}
              index={index}
              isReordering={isReordering}
            />
          ))}
            </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600 mb-4">
            {currentCategory !== 'all' 
              ? `No images found in the "${categories.find(c => c.id === currentCategory)?.name}" category.`
              : 'No images uploaded yet.'
            }
          </p>
          
          {/* Debug information for admin */}
          {isAdmin && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Debug Information</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>Current filter: <span className="font-mono bg-blue-100 px-1 rounded">{currentCategory}</span></p>
                <p>Sort by: <span className="font-mono bg-blue-100 px-1 rounded">{sortBy}</span></p>
                <p>Loading state: <span className="font-mono bg-blue-100 px-1 rounded">{loading ? 'Loading...' : 'Complete'}</span></p>
                <p>Available categories: <span className="font-mono bg-blue-100 px-1 rounded">{categories.map(c => c.id).join(', ')}</span></p>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                <p>💡 Tip: Check browser console for detailed query logs</p>
          </div>
        </div>
      )}

          {/* Helpful suggestions */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-4">
              {currentCategory !== 'all' 
                ? 'Try switching to "All Categories" or check if images were uploaded with the correct category.'
                : 'Start by uploading some images using the admin panel.'
              }
            </p>
            {currentCategory !== 'all' && (
              <button
                onClick={() => handleCategoryChange(null)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Categories
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {/* <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleBatchDelete}
        selectedCount={selectedImages.size}
      /> */}
    </div>
  );
};

export default GalleryGrid; 