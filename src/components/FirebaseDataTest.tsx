import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-de';

const FirebaseDataTest: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'images'));
        const imageData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setImages(imageData);
        console.log('Loaded images:', imageData);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    return <div className="p-4">Loading Firebase data...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Firebase Data Test</h2>
      <p className="mb-4">Found {images.length} images in Firebase</p>
      {images.length > 0 && (
        <div className="space-y-2">
          {images.slice(0, 5).map((image) => (
            <div key={image.id} className="p-2 border rounded">
              <p><strong>Title:</strong> {image.title}</p>
              <p><strong>Description:</strong> {image.description}</p>
              <p><strong>Category:</strong> {image.category}</p>
            </div>
          ))}
          {images.length > 5 && <p>... and {images.length - 5} more images</p>}
        </div>
      )}
    </div>
  );
};

export default FirebaseDataTest;

