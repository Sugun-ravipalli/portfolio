import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import { Lock, Camera } from 'lucide-react';

const Upload: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'thunderbuddies123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-dark-800 mb-2">
                Admin Access
              </h1>
              <p className="text-dark-600">
                Enter the admin password to upload images to the gallery.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Access Upload Panel
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-dark-500">
                Demo password: <code className="bg-dark-100 px-2 py-1 rounded">thunderbuddies123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-800 mb-4">
            Upload Images
          </h1>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Upload and organize your photography work. Add titles, categories, and preview images before publishing to the gallery.
          </p>
        </div>

        {/* Upload Form */}
        <UploadForm />

        {/* Logout Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-dark-600 hover:text-primary-600 transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload; 