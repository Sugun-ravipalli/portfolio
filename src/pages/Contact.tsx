import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Camera, 
  Heart, 
  MessageCircle, 
  Edit3, 
  Save, 
  X, 
  Settings 
} from 'lucide-react';
import { auth, db } from '../config/firebase-de';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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

  // Editable contact information - Professional contacts
  const [contactInfo, setContactInfo] = useState([
    {
      iconName: 'Mail',
      title: 'Email',
      value: 'ravipallisugun@gmail.com',
      link: 'mailto:ravipallisugun@gmail.com'
    },
    {
      iconName: 'Phone',
      title: 'Phone',
      value: '6823905902',
      link: 'tel:6823905902'
    },
    {
      iconName: 'MapPin',
      title: 'LinkedIn',
      value: 'linkedin.com/in/sai-sugun-ravipalli',
      link: 'https://www.linkedin.com/in/sai-sugun-ravipalli/'
    },
    {
      iconName: 'MapPin',
      title: 'Location',
      value: 'Dallas, Texas',
      link: '#'
    }
  ]);

  // Editable availability timings
  const [availabilityTimings, setAvailabilityTimings] = useState({
    weekdays: '9:00 AM - 6:00 PM CST',
    weekends: 'Available for urgent interviews',
    events: 'Immediate joining available'
  });

  const eventTypes = [
    'Data Engineering Position',
    'Senior Data Engineer Role',
    'Cloud Architecture Position',
    'Technical Interview',
    'Consulting Opportunity',
    'Freelance Project',
    'Other Professional Inquiry'
  ];

  // Function to get icon component by name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Mail':
        return Mail;
      case 'Phone':
        return Phone;
      case 'MapPin':
        return MapPin;
      default:
        return Mail;
    }
  };

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
      
      // 1. Send notification email TO sugunstories@gmail.com
      const notificationParams = {
        from_name: formData.name,
        from_email: formData.email,
        event_type: formData.eventType,
        message: formData.message,
        reply_to: formData.email,
        to_email: 'ravipallisugun@gmail.com'
      };

      console.log('Sending notification email...');
      console.log('Notification params:', notificationParams);
      console.log('EmailJS config:', {
        serviceId: 'sugunstories_emails',
        templateId: 'template_n0ak4ma',
        publicKey: 'cCU4hIQZDsgyXVCPa'
      });
      
      const notificationResult = await emailjs.send(
        'sugunstories_emails', // Your service ID
        'template_n0ak4ma', // Your Contact Us template ID
        notificationParams,
        'cCU4hIQZDsgyXVCPa' // Your public key
      );
      
      console.log('Notification email result:', notificationResult);
      console.log('Email sent successfully!');
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '', eventType: '' });
      
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      console.error('Email sending failed:', error);
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
        errorType: error?.constructor?.name || 'Unknown',
        errorText: error?.text || 'No error text'
      });
      
      // More specific error message
      let errorMessage = 'Sorry, there was an error sending your message. ';
      if (error?.message?.includes('template')) {
        errorMessage += 'Template ID might be incorrect.';
      } else if (error?.message?.includes('service')) {
        errorMessage += 'Service ID might be incorrect.';
      } else if (error?.message?.includes('public key')) {
        errorMessage += 'Public key might be incorrect.';
      } else {
        errorMessage += 'Please try again or contact me directly at ravipallisugun@gmail.com';
      }
      
      alert(errorMessage);
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
      // Save to Firebase
      const settingsRef = doc(db, 'settings', 'contact');
      await setDoc(settingsRef, {
        contactInfo,
        availabilityTimings,
        updatedAt: new Date()
      }, { merge: true });
      
      // Also save to localStorage as backup
      localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
      localStorage.setItem('availabilityTimings', JSON.stringify(availabilityTimings));
      
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values - Professional contacts
    setContactInfo([
      {
        iconName: 'Mail',
        title: 'Email',
        value: 'ravipallisugun@gmail.com',
        link: 'mailto:ravipallisugun@gmail.com'
      },
      {
        iconName: 'Phone',
        title: 'Phone',
        value: '6823905902',
        link: 'tel:6823905902'
      },
      {
        iconName: 'MapPin',
        title: 'LinkedIn',
        value: 'linkedin.com/in/sai-sugun-ravipalli',
        link: 'https://www.linkedin.com/in/sai-sugun-ravipalli/'
      },
      {
        iconName: 'MapPin',
        title: 'Location',
        value: 'Dallas, Texas',
        link: '#'
      }
    ]);
    // Reset availability timings to original values
    setAvailabilityTimings({
      weekdays: '9:00 AM - 6:00 PM CST',
      weekends: 'Available for urgent interviews',
      events: 'Immediate joining available'
    });
  };

  const handleContactInfoChange = (index: number, field: 'value' | 'link', newValue: string) => {
    const updatedContactInfo = [...contactInfo];
    updatedContactInfo[index] = {
      ...updatedContactInfo[index],
      [field]: newValue
    };
    setContactInfo(updatedContactInfo);
  };

  const handleAvailabilityChange = (field: 'weekdays' | 'weekends' | 'events', newValue: string) => {
    setAvailabilityTimings(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  // Load saved contact info and availability timings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Clear old data and use new defaults
        localStorage.removeItem('contactInfo');
        localStorage.removeItem('availabilityTimings');
        
        // Try to load from Firebase first
        const settingsRef = doc(db, 'settings', 'contact');
        const settingsDoc = await getDoc(settingsRef);
        
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          // Only load if the data is recent (after our changes)
          if (data.contactInfo && data.contactInfo.length === 4) {
            setContactInfo(data.contactInfo);
          }
          if (data.availabilityTimings) {
            setAvailabilityTimings(data.availabilityTimings);
          }
        }
      } catch (error) {
        console.error('Error loading settings from Firebase:', error);
      }
    };

    loadSettings();
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let&apos;s Discuss Your Data Engineering Needs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to explore how my expertise in data engineering, cloud platforms, and scalable architectures 
            can contribute to your team&apos;s success? I&apos;m excited to discuss opportunities and share how I can add immediate value.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
          <div className="flex items-center space-x-2 text-blue-600">
            <Mail className="h-5 w-5" />
            <span className="font-medium">ravipallisugun@gmail.com</span>
          </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>Dallas, Texas</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Contact Information
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                      {React.createElement(getIconComponent(info.iconName), { className: "h-8 w-8 text-white" })}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={info.value}
                          onChange={(e) => handleContactInfoChange(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder={`Enter ${info.title.toLowerCase()}`}
                        />
                        <input
                          type="text"
                          value={info.link}
                          onChange={(e) => handleContactInfoChange(index, 'link', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder={`Enter ${info.title.toLowerCase()} link`}
                        />
                      </div>
                    ) : (
                      <a
                        href={info.link}
                        target={info.title === 'LinkedIn' ? '_blank' : '_self'}
                        rel={info.title === 'LinkedIn' ? 'noopener noreferrer' : ''}
                        className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                      >
                        {info.value}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span>Availability</span>
              </h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Weekdays</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={availabilityTimings.weekdays}
                      onChange={(e) => handleAvailabilityChange('weekdays', e.target.value)}
                      className="bg-white px-3 py-1 rounded-full text-sm shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 10:00 AM - 8:00 PM"
                    />
                  ) : (
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow-sm">{availabilityTimings.weekdays}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Weekends</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={availabilityTimings.weekends}
                      onChange={(e) => handleAvailabilityChange('weekends', e.target.value)}
                      className="bg-white px-3 py-1 rounded-full text-sm shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  ) : (
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow-sm">{availabilityTimings.weekends}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Events</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={availabilityTimings.events}
                      onChange={(e) => handleAvailabilityChange('events', e.target.value)}
                      className="bg-white px-3 py-1 rounded-full text-sm shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Flexible timing"
                    />
                  ) : (
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow-sm">{availabilityTimings.events}</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 