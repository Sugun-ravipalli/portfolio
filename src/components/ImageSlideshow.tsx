import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase-de';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}

const ImageSlideshow: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const q = query(collection(db, 'images'), orderBy('uploadedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const imageData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Image[];
        setImages(imageData);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && images.length > 1) {
      interval = setInterval(() => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * images.length);
        } while (nextIndex === currentIndex && images.length > 1);
        setCurrentIndex(nextIndex);
      }, 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, images.length, currentIndex]);

  const goToPrevious = () => {
    let prevIndex;
    do {
      prevIndex = Math.floor(Math.random() * images.length);
    } while (prevIndex === currentIndex && images.length > 1);
    setCurrentIndex(prevIndex);
  };

  const goToNext = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * images.length);
    } while (nextIndex === currentIndex && images.length > 1);
    setCurrentIndex(nextIndex);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">No images available yet.</p>
        <p className="text-gray-500 mt-2">Upload some images to see them here!</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={currentImage.url}
          alt={currentImage.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay with description */}
        {currentImage.description && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-gray-200 text-lg">
              {currentImage.description}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlideshow;