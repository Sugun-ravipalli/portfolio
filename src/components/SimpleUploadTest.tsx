import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import toast from 'react-hot-toast';

const SimpleUploadTest: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name, file.size, file.type);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    console.log('=== STARTING UPLOAD TEST ===');

    try {
      // Step 1: Create storage reference
      const timestamp = Date.now();
      const fileName = `test_${timestamp}_${selectedFile.name}`;
      const storageRef = ref(storage, `test/${fileName}`);
      console.log('Storage reference created:', storageRef.fullPath);

      // Step 2: Upload to Storage
      console.log('Uploading to Firebase Storage...');
      const snapshot = await uploadBytes(storageRef, selectedFile);
      console.log('✅ Storage upload successful:', snapshot.ref.fullPath);

      // Step 3: Get download URL
      console.log('Getting download URL...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ Download URL obtained:', downloadURL.substring(0, 100) + '...');

      // Step 4: Save to Firestore
      console.log('Saving to Firestore...');
      const docRef = await addDoc(collection(db, 'test_images'), {
        fileName: fileName,
        originalName: selectedFile.name,
        url: downloadURL,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadedAt: new Date()
      });
      console.log('✅ Firestore document saved with ID:', docRef.id);

      toast.success('Upload test successful!');
      console.log('=== UPLOAD TEST COMPLETED SUCCESSFULLY ===');

    } catch (error) {
      console.error('❌ Upload test failed:', error);
      
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });

        if (error.message.includes('storage/unauthorized')) {
          toast.error('Storage access denied - check Firebase Storage rules');
        } else if (error.message.includes('storage/quota-exceeded')) {
          toast.error('Storage quota exceeded');
        } else if (error.message.includes('firestore/permission-denied')) {
          toast.error('Firestore access denied - check Firestore rules');
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
      } else {
        toast.error('Upload failed with unknown error');
      }
    } finally {
      setIsUploading(false);
      console.log('=== UPLOAD TEST FINISHED ===');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Simple Upload Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a test image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Test Upload'}
        </button>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Instructions:</strong>
          </p>
          <ul className="text-sm text-yellow-700 mt-1 space-y-1">
            <li>• Select a small image file (under 1MB)</li>
            <li>• Open browser console (F12) to see detailed logs</li>
            <li>• Check for any error messages in the console</li>
            <li>• This test uploads to a 'test' folder in Storage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleUploadTest; 