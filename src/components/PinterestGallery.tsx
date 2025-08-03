import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
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

interface PinterestGalleryProps {
  category?: string;
  isAdmin: boolean;
  onImageClick?: (image: Image) => void;
}

type SortOption = 'newest' | 'oldest' | 'manual' | 'title';

const PinterestGallery: React.FC<PinterestGalleryProps> = ({ 
  category, 
  isAdmin, 
  onImageClick 
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [internalCategory, setInternalCategory] = useState<string | null>(category || null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  
  const currentCategory = category || internalCategory || 'all';

  // Funny captions for empty categories
  const getFunnyCaption = (categoryName: string) => {
    const captions = [
      "Let him cook! 🍳",
      "The photographer is still in the kitchen... 👨‍🍳",
      "Photos are marinating... 🥘",
      "Chef's special coming soon! 👨‍🍳✨",
      "The camera is taking a coffee break ☕",
      "Photos are being seasoned to perfection 🌶️",
      "The lens is warming up 🔥",
      "Capturing the perfect moment... slowly 🐌",
      "Photos are fermenting like fine wine 🍷",
      "The shutter is doing yoga 🧘‍♂️",
      "Waiting for the golden hour... all day 🌅",
      "The memory card is on vacation 🏖️",
      "Photos are being aged like cheese 🧀",
      "The tripod is having a moment 📸",
      "Capturing memories... one pixel at a time 🎯"
    ];
    
    // Return a random caption
    return captions[Math.floor(Math.random() * captions.length)];
  };

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'birthdays', name: 'Birthdays' },
    { id: 'pre-wedding', name: 'Pre-Wedding' },
    { id: 'housewarming', name: 'Housewarming' },
    { id: 'events', name: 'Events' },
    { id: 'portraits', name: 'Portraits' },
    { id: 'wedding', name: 'Wedding' }
  ];

  // Update internal category when prop changes
  useEffect(() => {
    setInternalCategory(category || null);
  }, [category]);

  const handleCategoryChange = (newCategory: string | null) => {
    console.log('PinterestGallery: Category changed to:', newCategory);
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
          setLoading(false);
          
          if (error.code === 'permission-denied') {
            toast.error('Permission denied. Please check your Firebase rules.');
          } else if (error.code === 'unavailable') {
            toast.error('Firebase is temporarily unavailable. Please try again.');
          } else if (error.message.includes('index') || error.code === 'failed-precondition') {
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
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={currentCategory}
                onChange={(e) => handleCategoryChange(e.target.value === 'all' ? null : e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
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

          {/* Right side - Results count */}
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              {images.length} image{images.length !== 1 ? 's' : ''} found
              {currentCategory !== 'all' && ` in ${categories.find(c => c.id === currentCategory)?.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Pinterest Style Masonry Grid */}
      {images.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="break-inside-avoid group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
              onClick={() => handleImageClick(image)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Simple hover overlay for better UX */}
                <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300`}></div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    {categories.find(c => c.id === image.category)?.name || image.category}
                  </span>
                </div>
              </div>

              {/* No metadata - just the image and category tag */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {currentCategory !== 'all' 
              ? getFunnyCaption(categories.find(c => c.id === currentCategory)?.name || '')
              : "Let him cook! 🍳"
            }
          </h3>
          <p className="text-gray-600 mb-4">
            {currentCategory !== 'all' 
              ? `The "${categories.find(c => c.id === currentCategory)?.name}" category is still marinating...`
              : 'No images uploaded yet. Time to start cooking! 👨‍🍳'
            }
          </p>
          
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
    </div>
  );
};

export default PinterestGallery; 