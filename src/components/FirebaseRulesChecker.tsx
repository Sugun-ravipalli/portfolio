import React, { useState } from 'react';
import { auth, db, storage } from '../config/firebase-de';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

const FirebaseRulesChecker: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const addResult = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = isError ? '❌' : '✅';
    setResults(prev => [...prev, `${timestamp} ${icon} ${message}`]);
  };

  const runChecks = async () => {
    setIsChecking(true);
    setResults([]);
    
    try {
      // Check 1: Firebase initialization
      addResult('Checking Firebase initialization...');
      if (!auth || !db || !storage) {
        throw new Error('Firebase services not initialized');
      }
      addResult('Firebase services initialized successfully');

      // Check 2: Authentication with existing user
      addResult('Testing authentication with admin user...');
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        'ravipallisugun@gmail.com', 
        'Masters@261313'
      );
      addResult(`Authentication successful - User ID: ${userCredential.user.uid}`);

      // Check 3: Test reading from images collection
      addResult('Testing read from images collection...');
      const imagesSnapshot = await getDocs(collection(db, 'images'));
      addResult(`Images collection read successful - Found ${imagesSnapshot.size} images`);
      
      if (imagesSnapshot.size > 0) {
        imagesSnapshot.forEach((doc) => {
          const data = doc.data();
          addResult(`Found image: ${data.title} (${data.category})`);
        });
      }

      // Check 4: Firestore write permission
      addResult('Testing Firestore write permission...');
      const testDoc = await addDoc(collection(db, 'rules_test'), {
        test: true,
        timestamp: new Date(),
        message: 'Testing write permissions'
      });
      addResult(`Firestore write successful - Document ID: ${testDoc.id}`);

      // Check 5: Firestore read permission
      addResult('Testing Firestore read permission...');
      const snapshot = await getDocs(collection(db, 'rules_test'));
      addResult(`Firestore read successful - Found ${snapshot.size} documents`);

      // Check 6: Storage write permission
      addResult('Testing Storage write permission...');
      const testBlob = new Blob(['test content'], { type: 'text/plain' });
      const storageRef = ref(storage, 'rules_test/test-file.txt');
      const uploadSnapshot = await uploadBytes(storageRef, testBlob);
      addResult(`Storage write successful - Path: ${uploadSnapshot.ref.fullPath}`);

      // Check 7: Storage read permission
      addResult('Testing Storage read permission...');
      const downloadURL = await getDownloadURL(uploadSnapshot.ref);
      addResult(`Storage read successful - URL obtained`);

      // Check 8: Cleanup test data
      addResult('Cleaning up test data...');
      await deleteDoc(doc(db, 'rules_test', testDoc.id));
      await deleteObject(uploadSnapshot.ref);
      addResult('Test data cleaned up successfully');

      addResult('🎉 All Firebase rules checks passed! Your configuration is working correctly.');

    } catch (error) {
      console.error('Rules check error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          addResult('Storage access denied - Firebase Storage rules are too restrictive', true);
          addResult('You need to update your Firebase Storage rules to allow uploads', true);
        } else if (error.message.includes('firestore/permission-denied')) {
          addResult('Firestore access denied - Firestore rules are too restrictive', true);
          addResult('You need to update your Firestore rules to allow writes', true);
        } else if (error.message.includes('auth/user-not-found') || error.message.includes('auth/wrong-password')) {
          addResult('Authentication failed - check your admin credentials', true);
          addResult('Make sure ravipallisugun@gmail.com exists and password is correct', true);
        } else if (error.message.includes('auth/admin-restricted-operation')) {
          addResult('Anonymous auth is disabled - using email/password instead', true);
        } else {
          addResult(`Check failed: ${error.message}`, true);
        }
      } else {
        addResult('Unknown error occurred during checks', true);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const getFirebaseRules = () => {
    return {
      storage: `// Firebase Storage Rules (copy to Firebase Console)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}`,
      firestore: `// Firestore Rules (copy to Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`
    };
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Firebase Rules Checker</h2>
      
      <button
        onClick={runChecks}
        disabled={isChecking}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isChecking ? 'Running Checks...' : 'Run Rules Check'}
      </button>

      <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto mb-6">
        <h3 className="font-semibold mb-2">Check Results:</h3>
        {results.length === 0 ? (
          <p className="text-gray-500">No checks run yet. Click the button above to start.</p>
        ) : (
          <div className="space-y-1">
            {results.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Firebase Storage Rules:</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
            {getFirebaseRules().storage}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Firestore Rules:</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
            {getFirebaseRules().firestore}
          </pre>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">How to fix rules issues:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Go to Firebase Console → Storage → Rules</li>
            <li>2. Replace the rules with the Storage rules above</li>
            <li>3. Go to Firebase Console → Firestore → Rules</li>
            <li>4. Replace the rules with the Firestore rules above</li>
            <li>5. Publish the rules</li>
            <li>6. Run the checks again</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FirebaseRulesChecker; 