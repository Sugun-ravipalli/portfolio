import React, { useState } from 'react';
import { auth, db, storage } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';

const FirebaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkExistingImages = async () => {
    try {
      addLog('Checking for existing images in Firestore...');
      const imagesSnapshot = await getDocs(collection(db, 'images'));
      addLog(`Found ${imagesSnapshot.size} images in database`);
      
      if (imagesSnapshot.size > 0) {
        imagesSnapshot.forEach((doc) => {
          const data = doc.data();
          addLog(`- Image: ${data.title} (${data.category}) - ${data.url.substring(0, 50)}...`);
        });
      } else {
        addLog('No images found in database');
      }
    } catch (error) {
      addLog(`❌ Error checking images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    try {
      // Test 1: Check if services are initialized
      addLog('Testing Firebase services initialization...');
      if (!auth || !db || !storage) {
        throw new Error('Firebase services not initialized');
      }
      addLog('✅ Firebase services initialized successfully');

      // Test 2: Test Auth with email/password
      addLog('Testing Firebase Auth with admin user...');
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        'ravipallisugun@gmail.com', 
        'Masters@261313'
      );
      addLog(`✅ Auth successful - User ID: ${userCredential.user.uid}`);

      // Test 3: Check existing images
      await checkExistingImages();

      // Test 4: Test Firestore write
      addLog('Testing Firestore write...');
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Test document',
        timestamp: new Date()
      });
      addLog(`✅ Firestore write successful - Document ID: ${testDoc.id}`);

      // Test 5: Test Firestore read
      addLog('Testing Firestore read...');
      const snapshot = await getDocs(collection(db, 'test'));
      addLog(`✅ Firestore read successful - Found ${snapshot.size} documents`);

      // Test 6: Test Storage upload (with a small test file)
      addLog('Testing Firebase Storage upload...');
      const testBlob = new Blob(['test content'], { type: 'text/plain' });
      const storageRef = ref(storage, 'test/test-file.txt');
      const uploadSnapshot = await uploadBytes(storageRef, testBlob);
      addLog(`✅ Storage upload successful - Path: ${uploadSnapshot.ref.fullPath}`);

      // Test 7: Test Storage download URL
      addLog('Testing Storage download URL...');
      const downloadURL = await getDownloadURL(uploadSnapshot.ref);
      addLog(`✅ Download URL obtained: ${downloadURL.substring(0, 50)}...`);

      addLog('🎉 All Firebase tests passed successfully!');

    } catch (error) {
      console.error('Firebase test error:', error);
      if (error instanceof Error) {
        if (error.message.includes('auth/user-not-found') || error.message.includes('auth/wrong-password')) {
          addLog('❌ Auth failed - check admin credentials (ravipallisugun@gmail.com)');
        } else {
          addLog(`❌ Test failed: ${error.message}`);
        }
      } else {
        addLog('❌ Test failed with unknown error');
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Firebase Connection Test</h2>
      
      <button
        onClick={runTests}
        disabled={isTesting}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isTesting ? 'Running Tests...' : 'Run Firebase Tests'}
      </button>

      <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click the button above to start testing.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseTest; 