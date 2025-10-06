import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase-de';
import { X, Save, Edit3, Eye } from 'lucide-react';

interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  slideshowTitle: string;
  slideshowSubtitle: string;
  servicesTitle: string;
  servicesSubtitle: string;
  statsTitle: string;
  statsSubtitle: string;
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
}

interface HomepageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const defaultContent: HomepageContent = {
  heroTitle: "Sugunstories",
  heroSubtitle: "Capturing life's beautiful moments through the lens of creativity and passion. Every story deserves to be told beautifully.",
  slideshowTitle: "Featured Moments",
  slideshowSubtitle: "Watch our beautiful collection of captured memories in this stunning slideshow. Each image tells a unique story of joy, love, and celebration.",
  servicesTitle: "Photography Services",
  servicesSubtitle: "From intimate gatherings to grand celebrations, I capture every moment with creativity and attention to detail.",
  statsTitle: "Our Journey in Numbers",
  statsSubtitle: "Every number represents a story, a moment, and a memory we've helped create.",
  whyChooseTitle: "Why Choose Sugunstories?",
  whyChooseSubtitle: "Professional photography with a personal touch",
  ctaTitle: "Ready to Capture Your Special Moments?",
  ctaSubtitle: "Let's work together to create beautiful memories that will last a lifetime. Get in touch to discuss your photography needs and start your journey with Sugunstories."
};

const HomepageEditor: React.FC<HomepageEditorProps> = ({ isOpen, onClose, onSave }) => {
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadContent();
    }
  }, [isOpen]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'settings', 'homepage');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent({ ...defaultContent, ...docSnap.data() });
      } else {
        setContent(defaultContent);
      }
    } catch (error: any) {
      console.error('Error loading homepage content:', error);
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const docRef = doc(db, 'settings', 'homepage');
    try {
      setSaving(true);
      await updateDoc(docRef, content as Record<string, any>);
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving homepage content:', error);
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        try {
          await setDoc(docRef, content as Record<string, any>);
          onSave();
          onClose();
        } catch (createError) {
          console.error('Error creating homepage content:', createError);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof HomepageContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Edit3 className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Edit Homepage Content</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {previewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{previewMode ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : previewMode ? (
            <div className="space-y-8">
              {/* Hero Section Preview */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">{content.heroTitle}</h3>
                <p className="text-blue-100">{content.heroSubtitle}</p>
              </div>

              {/* Slideshow Section Preview */}
              <div className="bg-white border border-gray-200 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.slideshowTitle}</h3>
                <p className="text-gray-600">{content.slideshowSubtitle}</p>
              </div>

              {/* Services Section Preview */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.servicesTitle}</h3>
                <p className="text-gray-600">{content.servicesSubtitle}</p>
              </div>

              {/* Stats Section Preview */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">{content.statsTitle}</h3>
                <p className="text-blue-100">{content.statsSubtitle}</p>
              </div>

              {/* Why Choose Section Preview */}
              <div className="bg-white border border-gray-200 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.whyChooseTitle}</h3>
                <p className="text-gray-600">{content.whyChooseSubtitle}</p>
              </div>

              {/* CTA Section Preview */}
              <div className="bg-gray-900 text-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">{content.ctaTitle}</h3>
                <p className="text-gray-300">{content.ctaSubtitle}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Hero Section</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                  <input
                    type="text"
                    value={content.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter main title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.heroSubtitle}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subtitle"
                  />
                </div>
              </div>

              {/* Slideshow Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Slideshow Section</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.slideshowTitle}
                    onChange={(e) => handleInputChange('slideshowTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter slideshow title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.slideshowSubtitle}
                    onChange={(e) => handleInputChange('slideshowSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter slideshow subtitle"
                  />
                </div>
              </div>

              {/* Services Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Services Section</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.servicesTitle}
                    onChange={(e) => handleInputChange('servicesTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter services title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.servicesSubtitle}
                    onChange={(e) => handleInputChange('servicesSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter services subtitle"
                  />
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Stats Section</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.statsTitle}
                    onChange={(e) => handleInputChange('statsTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter stats title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.statsSubtitle}
                    onChange={(e) => handleInputChange('statsSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter stats subtitle"
                  />
                </div>
              </div>

              {/* Why Choose Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Why Choose Section</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.whyChooseTitle}
                    onChange={(e) => handleInputChange('whyChooseTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter why choose title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.whyChooseSubtitle}
                    onChange={(e) => handleInputChange('whyChooseSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter why choose subtitle"
                  />
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Call to Action Section</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.ctaTitle}
                    onChange={(e) => handleInputChange('ctaTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter CTA title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.ctaSubtitle}
                    onChange={(e) => handleInputChange('ctaSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter CTA subtitle"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomepageEditor; 