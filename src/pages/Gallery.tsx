import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import PinterestGallery from '../components/PinterestGallery';
import ImageViewerModal from '../components/ImageViewerModal';
import CategoryFilter from '../components/CategoryFilter';
import {
  Gift,
  Heart,
  Home,
  Users,
  Camera,
  Calendar,
  Settings,
  Grid
} from 'lucide-react';

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

const Gallery: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewerImage, setViewerImage] = useState<Image | null>(null);
  const [viewerImages, setViewerImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Check if user is logged in for admin status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    {
      id: 'birthdays',
      name: 'Birthdays',
      icon: Gift,
      description: 'Celebrate life\'s special moments',
      color: 'from-pink-500 to-red-500'
    },
    {
      id: 'pre-wedding',
      name: 'Pre-Wedding',
      icon: Heart,
      description: 'Romantic pre-wedding photo sessions',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'housewarming',
      name: 'Housewarming',
      icon: Home,
      description: 'New beginnings and celebrations',
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'events',
      name: 'Events',
      icon: Calendar,
      description: 'Corporate and social gatherings',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'portraits',
      name: 'Portraits',
      icon: Users,
      description: 'Professional portrait photography',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'wedding',
      name: 'Wedding',
      icon: Heart,
      description: 'Beautiful wedding ceremonies',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'graduation',
      name: 'Graduation',
      icon: Camera,
      description: 'Academic achievements and milestones',
      color: 'from-green-500 to-blue-500'
    }
  ];

  const handleImageClick = (image: Image) => {
    setViewerImage(image);
    // For now, we'll just show the single image
    // In a full implementation, you'd load all images in the current category
    setViewerImages([image]);
    setCurrentImageIndex(0);
  };

  const handleViewerNavigate = (index: number) => {
    setCurrentImageIndex(index);
    setViewerImage(viewerImages[index]);
  };

  const handleViewerClose = () => {
    setViewerImage(null);
    setViewerImages([]);
    setCurrentImageIndex(0);
  };

  const handleEditImage = (image: Image) => {
    // This could open an edit modal or navigate to an edit page
    console.log('Edit image:', image);
  };

  const handleCategoryChange = (category: string | null) => {
    console.log('Category changed to:', category);
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Camera className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Photo Gallery
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore our collection of beautiful moments captured through the lens.
              Each photo tells a unique story of joy, love, and celebration.
            </p>



            {/* Category Filter Pills */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              showDropdown={false}
              showBubbles={true}
              className="justify-center"
            />
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory
                ? categories.find(c => c.id === selectedCategory)?.name + ' Photos'
                : 'All Photo Collections'
              }
            </h2>
            <p className="text-gray-600">
              {selectedCategory
                ? categories.find(c => c.id === selectedCategory)?.description
                : 'Browse through our diverse collection of photography'
              }
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Grid className="h-4 w-4" />
              <span>Professional Gallery</span>
            </div>

            {isAdmin && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Settings className="h-4 w-4" />
                <span>Admin Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Pinterest Style Gallery */}
        <PinterestGallery
          category={selectedCategory || undefined}
          isAdmin={isAdmin}
          onImageClick={handleImageClick}
        />
      </div>

             {/* Portfolio Call to Action */}
       <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
           <div className="text-center">
             <h2 className="text-4xl font-bold mb-6">
               Let's Create Something Amazing Together
             </h2>
             <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
               I'm passionate about capturing beautiful moments and telling stories through photography.
               If you're interested in collaborating on creative projects, I'd love to hear from you!
             </p>
             <div className="flex justify-center">
               <Link 
                 to="/contact"
                 className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
               >
                 Let's Collaborate
               </Link>
             </div>
           </div>
         </div>
       </div>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={!!viewerImage}
        onClose={handleViewerClose}
        image={viewerImage}
        images={viewerImages}
        currentIndex={currentImageIndex}
        onNavigate={handleViewerNavigate}
        isAdmin={isAdmin}
        onEdit={handleEditImage}
      />
    </div>
  );
};

export default Gallery; 