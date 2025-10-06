import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase-de';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Image {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  url?: string;
  uploadedAt?: any;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  order?: number;
}

const FirebaseDebugger: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDebug = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('🔍 Starting Firebase debug...');
      
      // Test 1: Check if we can access images collection without auth
      console.log('📂 Testing public access to images collection...');
      const imagesRef = collection(db, 'images');
      const imagesSnapshot = await getDocs(imagesRef);
      
      const images = imagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Image[];

      console.log(`✅ Found ${images.length} images in database`);
      
      // Group images by category
      const categoryStats: { [key: string]: number } = {};
      images.forEach(img => {
        const category = img.category || 'uncategorized';
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });

      // Test 2: Check authentication status
      console.log('🔐 Checking authentication status...');
      const authState = await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user ? { uid: user.uid, email: user.email } : null);
        });
      });

      setResults({
        totalImages: images.length,
        categoryStats,
        sampleImages: images.slice(0, 3),
        authStatus: authState,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Debug completed successfully');
    } catch (err: any) {
      console.error('❌ Debug failed:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Firebase Debugger</h3>
        <button
          onClick={runDebug}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Running...</span>
            </div>
          ) : (
            'Run Debug'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 font-medium">Error:</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-blue-700">Total Images</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{results.totalImages}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-green-700">Categories</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">{Object.keys(results.categoryStats).length}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                {results.authStatus ? (
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-purple-500" />
                )}
                <span className="font-semibold text-purple-700">Auth Status</span>
              </div>
              <p className="text-sm text-purple-900 mt-1">
                {results.authStatus ? 'Logged In' : 'Not Logged In'}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Images by Category</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(results.categoryStats).map(([category, count]) => (
                <div key={category} className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">{category}</p>
                  <p className="text-2xl font-bold text-blue-600">{count as number}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Images */}
          {results.sampleImages.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Sample Images</h4>
              <div className="space-y-2">
                {results.sampleImages.map((img: Image) => (
                  <div key={img.id} className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-900">{img.title || 'Untitled'}</p>
                    <p className="text-sm text-gray-600">Category: {img.category || 'uncategorized'}</p>
                    <p className="text-sm text-gray-600">ID: {img.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Recommendations</h4>
            <div className="space-y-2 text-sm text-yellow-800">
              {results.totalImages === 0 ? (
                <p>⚠️ No images found in database. Upload some images first.</p>
              ) : (
                <p>✅ Images found in database. If gallery is empty, check Firebase rules.</p>
              )}
              {!results.authStatus && (
                <p>ℹ️ You are not logged in. This is normal for public gallery access.</p>
              )}
              <p>🔧 If images exist but don't show in gallery, update Firestore rules to allow public read access.</p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-gray-500 text-center">
            Last updated: {new Date(results.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseDebugger; 