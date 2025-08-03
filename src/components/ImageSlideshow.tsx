import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface Image {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  uploadedAt: any;
}

interface ImageSlideshowProps {
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  className = ''
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying && images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, images.length, interval]);

  // Function to check if an image is landscape with timeout and better performance
  const isLandscapeImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.log(`Timeout for image: ${url}`);
        resolve(false);
      }, 5000); // 5 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        const aspectRatio = img.width / img.height;
        const isLandscape = aspectRatio >= 1.5;
        console.log(`Image aspect ratio: ${aspectRatio.toFixed(2)} (${img.width}x${img.height}) - ${isLandscape ? 'Landscape' : 'Portrait'}`);
        resolve(isLandscape);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.log(`Failed to load image: ${url}`);
        resolve(false);
      };
      
      img.src = url;
    });
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting to load images for slideshow...');
      
      const imagesRef = collection(db, 'images');
      const q = query(imagesRef);
      const snapshot = await getDocs(q);
      
      const loadedImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Image[];

      console.log(`📥 Loaded ${loadedImages.length} images from database, checking aspect ratios...`);

      // Check all images in parallel for much faster loading
      const aspectRatioPromises = loadedImages.map(async (image) => {
        const isLandscape = await isLandscapeImage(image.url);
        return { image, isLandscape };
      });

      const results = await Promise.all(aspectRatioPromises);
      const landscapeImages = results
        .filter(result => result.isLandscape)
        .map(result => result.image);

      console.log(`✅ Found ${landscapeImages.length} landscape images out of ${loadedImages.length} total`);

      // Shuffle images in truly random order using Fisher-Yates algorithm
      const shuffledImages = [...landscapeImages];
      for (let i = shuffledImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
      }

      console.log(`🎯 Slideshow ready with ${shuffledImages.length} images in random order`);
      setImages(shuffledImages);
    } catch (error) {
      console.error('Error loading images for slideshow:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className={`relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading slideshow...</p>
          <p className="text-gray-500 text-sm mt-2">Checking image dimensions for optimal display</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
                     <p className="text-gray-600">No wide landscape images available for slideshow</p>
           <p className="text-gray-500 text-sm mt-2">Only wide landscape images (1.5:1 ratio or wider) are displayed here for optimal slideshow viewing</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className={`relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-full">
                 <img
           src={currentImage.url}
           alt={currentImage.title}
           className="w-full h-full object-cover object-center transition-opacity duration-1000"
           style={{ objectFit: 'cover', objectPosition: 'center' }}
         />
        
                 {/* Overlay with image info */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
           <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
             <div className="flex items-center space-x-4">
               <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                 {currentImage.category}
               </span>
             </div>
           </div>
         </div>

        {/* Image counter */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute top-4 left-4 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </>
      )}

             {/* Removed dot tracker as requested - clean slideshow display only */}
    </div>
  );
};

export default ImageSlideshow; 