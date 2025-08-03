import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Heart, Users, Calendar } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div className="container-custom section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                Capturing Your
                <span className="text-gradient block">Special Moments</span>
              </h1>
              <p className="text-xl text-dark-200 leading-relaxed">
                Professional photography services for birthdays, housewarmings, 
                pre-wedding shoots, and special events. Let me tell your story 
                through beautiful, timeless images.
              </p>
            </div>

            {/* Services Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-dark-200">
                <Calendar className="h-5 w-5 text-primary-400" />
                <span>Events</span>
              </div>
              <div className="flex items-center space-x-3 text-dark-200">
                <Heart className="h-5 w-5 text-primary-400" />
                <span>Weddings</span>
              </div>
              <div className="flex items-center space-x-3 text-dark-200">
                <Users className="h-5 w-5 text-primary-400" />
                <span>Parties</span>
              </div>
              <div className="flex items-center space-x-3 text-dark-200">
                <Camera className="h-5 w-5 text-primary-400" />
                <span>Portraits</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/gallery"
                className="btn-primary inline-flex items-center justify-center space-x-2"
              >
                <span>View Gallery</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Camera className="h-24 w-24 text-white mx-auto" />
                  <p className="text-white text-lg font-medium">
                    Professional Photography
                  </p>
                  <p className="text-primary-100">
                    Every moment deserves to be captured beautifully
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 