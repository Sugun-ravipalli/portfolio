import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import ImageSlideshow from '../components/ImageSlideshow';
import HomepageEditor from '../components/HomepageEditor';
import { Camera, Heart, Users, Calendar, Star, Award, ArrowRight, Play, Instagram, Edit3 } from 'lucide-react';

const Home: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [content, setContent] = useState({
    heroTitle: "Sugunstories",
    heroSubtitle: "Capturing life's beautiful moments through the lens of creativity and passion. Every story deserves to be told beautifully.",
    slideshowTitle: "Featured Moments",
    slideshowSubtitle: "Watch our beautiful collection of captured memories in this stunning slideshow. Each image tells a unique story of joy, love, and celebration.",
    servicesTitle: "Portfolio Highlights",
    servicesSubtitle: "Explore my photography work across different categories and styles. Each image represents a unique story and creative vision.",
    statsTitle: "My Photography Journey",
    statsSubtitle: "Every number represents a story captured, a moment preserved, and a memory documented.",
    whyChooseTitle: "About My Photography",
    whyChooseSubtitle: "Passionate about capturing authentic moments with creative vision",
    ctaTitle: "Interested in Collaborating?",
    ctaSubtitle: "I'm always excited to work on creative projects and collaborations. Let's discuss how we can create something amazing together!"
  });

  const portfolioCategories = [
    {
      icon: Calendar,
      title: 'Birthday Celebrations',
      description: 'Capturing the joy and excitement of birthday celebrations through candid moments and beautiful compositions.',
      features: ['Candid moments', 'Group photos', 'Decor details', 'Cake cutting ceremony'],
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Heart,
      title: 'Pre-Wedding Photography',
      description: 'Beautiful pre-wedding photography that tells love stories through stunning visuals and creative storytelling.',
      features: ['Engagement shoots', 'Couple portraits', 'Location shoots', 'Storytelling sessions'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Housewarming Events',
      description: 'Documenting the special moments of housewarming celebrations and new beginnings in life.',
      features: ['Home tours', 'Family gatherings', 'House blessings', 'Celebration moments'],
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Camera,
      title: 'Event Coverage',
      description: 'Creative coverage of various events, from corporate gatherings to personal celebrations.',
      features: ['Corporate events', 'Parties', 'Ceremonies', 'Special occasions'],
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Photos Captured' },
    { number: '1000+', label: 'Memories Preserved' },
    { number: '50+', label: 'Events Documented' },
    { number: '5+', label: 'Years of Passion' }
  ];

  useEffect(() => {
    // Check if user is logged in for admin status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const docRef = doc(db, 'settings', 'homepage');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error: any) {
      console.error('Error loading homepage content:', error);
    }
  };

  const handleContentSave = () => {
    loadContent(); // Reload content after save
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Slideshow */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Admin Edit Button */}
          {isAdmin && (
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowEditor(true)}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
              >
                <Edit3 className="h-4 w-4" />
                <span className="text-sm font-medium">Edit Content</span>
              </button>
            </div>
          )}
          
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Camera className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-relaxed px-4 py-2">
              {content.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/gallery"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center"
              >
                View Gallery
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Slideshow Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.slideshowTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.slideshowSubtitle}
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <ImageSlideshow 
              autoPlay={true}
              interval={4000}
              showControls={true}
              showIndicators={false}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.servicesTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.servicesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {portfolioCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {category.description}
                </p>
                <ul className="space-y-3">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.statsTitle}
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {content.statsSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                {content.whyChooseTitle}
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Creative Vision
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      A unique artistic perspective that transforms ordinary moments into extraordinary visual stories.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Authentic Storytelling
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Years of experience capturing authentic moments with a keen eye for storytelling through photography.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Passion for Photography
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Tailored photography packages to meet your specific needs and preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-center space-y-6 p-8">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                    <Camera className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-2xl font-bold mb-2">
                      Professional Photography
                    </p>
                    <p className="text-blue-100 text-lg">
                      Every moment deserves to be captured beautifully
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Play className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {content.ctaTitle}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {content.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/gallery"
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all inline-flex items-center justify-center"
            >
              View Gallery
            </Link>
          </div>
          
                     {/* Instagram Link */}
           <div className="mt-12 flex justify-center">
             <a 
               href="https://www.instagram.com/sugunstories/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
             >
               <Instagram className="h-6 w-6" />
             </a>
           </div>
        </div>
      </section>

      {/* Homepage Editor Modal */}
      <HomepageEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleContentSave}
      />
    </div>
  );
};

export default Home; 