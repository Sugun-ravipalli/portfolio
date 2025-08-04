import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Camera, 
  Heart, 
  Instagram, 
  MessageCircle, 
  Edit3, 
  Save, 
  X, 
  Settings 
} from 'lucide-react';
import { auth } from '../config/firebase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    eventType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable contact information - Only Instagram for public display
  const [contactInfo, setContactInfo] = useState([
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@sugunstories',
      link: 'https://www.instagram.com/sugunstories/'
    }
  ]);

  const eventTypes = [
    'Wedding Photography',
    'Pre-Wedding Shoot',
    'Engagement Session',
    'Birthday Celebration',
    'Family Portrait',
    'Event Photography',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Check if user is logged in for admin status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Starting email submission...');
      console.log('Form data:', formData);
      
      // Send email using EmailJS - This will send TO sugunstories@gmail.com
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        event_type: formData.eventType,
        message: formData.message,
        reply_to: formData.email,
        to_email: 'sugunstories@gmail.com'
      };

      console.log('Template params:', templateParams);
      console.log('EmailJS config:', {
        serviceId: 'sugunstories_emails',
        templateId: 'template_n0ak4ma',
        publicKey: 'cCU4hIQZDsgyXVCPa'
      });

      const result =       await emailjs.send(
        'sugunstories_emails', // Your service ID
        'template_n0ak4ma', // Your Contact Us template ID
        templateParams,
        'cCU4hIQZDsgyXVCPa' // Your public key
      );
      
      console.log('EmailJS result:', result);
      console.log('Email sent successfully:', formData);
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '', eventType: '' });
      
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      console.error('Email sending failed:', error);
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace'
      });
      alert('Sorry, there was an error sending your message. Please try again or contact me directly at sugunstories@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin functions
  const handleLogout = () => {
    auth.signOut();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving to localStorage or database
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values - Only Instagram
    setContactInfo([
      {
        icon: Instagram,
        title: 'Instagram',
        value: '@sugunstories',
        link: 'https://www.instagram.com/sugunstories/'
      }
    ]);
  };

  const handleContactInfoChange = (index: number, field: 'value' | 'link', newValue: string) => {
    const updatedContactInfo = [...contactInfo];
    updatedContactInfo[index] = {
      ...updatedContactInfo[index],
      [field]: newValue
    };
    setContactInfo(updatedContactInfo);
  };

  // Load saved contact info on component mount
  useEffect(() => {
    const savedContactInfo = localStorage.getItem('contactInfo');
    if (savedContactInfo) {
      try {
        const parsed = JSON.parse(savedContactInfo);
        setContactInfo(parsed);
      } catch (error) {
        console.error('Error loading saved contact info:', error);
      }
    }
  }, []);

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Admin Controls - Only visible when logged in */}
        {isAdmin && (
          <div className="text-right mb-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-2">
              <span className="text-sm font-medium">Admin Mode</span>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center space-x-1"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 transition-colors flex items-center space-x-1 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition-colors flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Contact details saved successfully!</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="h-10 w-10 text-white" />
          </div>
                     <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-800 mb-4">
             Let&apos;s Create Magic Together
           </h1>
                     <p className="text-lg text-dark-600 max-w-2xl mx-auto">
             Ready to turn your special moments into timeless stories? I&apos;m here to capture 
             the love, joy, and beauty in every frame. Let&apos;s make your dreams come true.
           </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 text-primary-600">
              <Heart className="h-5 w-5" />
              <span className="font-medium">@sugunstories</span>
            </div>
            <div className="w-px h-6 bg-dark-300"></div>
            <div className="flex items-center space-x-2 text-dark-600">
              <MessageCircle className="h-5 w-5" />
              <span>Richardson, Texas</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-dark-800">
                Tell Me Your Story
              </h2>
            </div>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">Thank you! Your message has been sent successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-dark-700 mb-2">
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select an event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-dark-700 mb-2">
                  Message *
                </label>
                                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                         placeholder="Share your vision, dreams, and the story you want to tell. What makes your moment special? I&apos;d love to hear about your event details, preferred style, and any specific requirements..."
                  />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                                         <span>Let&apos;s Start Your Story</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-dark-800">
                  Let&apos;s Connect
                </h2>
              </div>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark-800 mb-1">
                        {info.title}
                      </h3>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={info.value}
                            onChange={(e) => handleContactInfoChange(index, 'value', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder={`Enter ${info.title.toLowerCase()}`}
                          />
                          <input
                            type="text"
                            value={info.link}
                            onChange={(e) => handleContactInfoChange(index, 'link', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder={`Enter ${info.title.toLowerCase()} link`}
                          />
                        </div>
                      ) : (
                        <a
                          href={info.link}
                          target={info.title === 'Instagram' ? '_blank' : '_self'}
                          rel={info.title === 'Instagram' ? 'noopener noreferrer' : ''}
                          className="text-dark-600 hover:text-pink-600 transition-colors font-medium"
                        >
                          {info.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
              <h3 className="text-xl font-semibold text-dark-800 mb-4 flex items-center space-x-2">
                <Camera className="h-5 w-5 text-pink-600" />
                <span>Availability</span>
              </h3>
              <div className="space-y-3 text-dark-600">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Weekdays</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm shadow-sm">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Weekends</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm shadow-sm">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Events</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm shadow-sm">Flexible timing</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-dark-800 mb-3 flex items-center space-x-2">
                <Heart className="h-5 w-5 text-purple-600" />
                <span>My Promise to You</span>
              </h3>
              <p className="text-dark-600 leading-relaxed">
                I respond to all inquiries within 12 hours, and I&apos;m always excited to hear about your special moments. 
                Let&apos;s create something beautiful together! 💕
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 