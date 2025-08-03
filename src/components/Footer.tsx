import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail, Phone, MapPin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-serif font-semibold">
                Sugunstories
              </span>
            </Link>
            <p className="text-dark-300 leading-relaxed">
              Capturing life&apos;s precious moments with passion and creativity. 
              Professional photography services for all your special occasions.
            </p>
                         <div className="flex space-x-4">
               <a
                 href="https://www.instagram.com/sugunstories/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="p-2 bg-dark-800 rounded-full hover:bg-primary-500 transition-colors duration-200"
               >
                 <Instagram className="h-5 w-5" />
               </a>
             </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-dark-300">
              <li>
                <Link to="/gallery" className="hover:text-primary-400 transition-colors">
                  Birthday Photography
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary-400 transition-colors">
                  Housewarming Events
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary-400 transition-colors">
                  Pre-Wedding Shoots
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary-400 transition-colors">
                  Corporate Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-dark-300">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary-400 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-primary-400 transition-colors">
                  Upload
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-dark-300">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <span>sugunstories@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400" />
                <span>682-390-5902</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-400" />
                <span>Richardson, Texas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-dark-400 text-sm">
              © 2024 Sugunstories. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-dark-400">
              <a href="#" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 