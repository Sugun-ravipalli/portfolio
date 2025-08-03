import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { Camera, Heart, Users, Calendar, Star, Award } from 'lucide-react';

const Home: React.FC = () => {
  const services = [
    {
      icon: Calendar,
      title: 'Birthday Photography',
      description: 'Capture the joy and excitement of birthday celebrations with our professional photography services.',
      features: ['Candid moments', 'Group photos', 'Decor details', 'Cake cutting ceremony']
    },
    {
      icon: Heart,
      title: 'Pre-Wedding Shoots',
      description: 'Beautiful pre-wedding photography sessions to tell your love story in stunning visuals.',
      features: ['Engagement shoots', 'Couple portraits', 'Location shoots', 'Storytelling sessions']
    },
    {
      icon: Users,
      title: 'Housewarming Events',
      description: 'Document the special moments of housewarming celebrations and new beginnings.',
      features: ['Home tours', 'Family gatherings', 'House blessings', 'Celebration moments']
    },
    {
      icon: Camera,
      title: 'Event Photography',
      description: 'Professional coverage for all types of events, from corporate to personal celebrations.',
      features: ['Corporate events', 'Parties', 'Ceremonies', 'Special occasions']
    }
  ];

  const stats = [
    { number: '500+', label: 'Happy Clients' },
    { number: '1000+', label: 'Photos Delivered' },
    { number: '50+', label: 'Events Covered' },
    { number: '5+', label: 'Years Experience' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-800 mb-4">
              Photography Services
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              From intimate gatherings to grand celebrations, I capture every moment 
              with creativity and attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-dark-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-dark-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-dark-600">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
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
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-800 mb-6">
                Why Choose PhotoStudio?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-800 mb-2">
                      Professional Quality
                    </h3>
                    <p className="text-dark-600">
                      High-quality images with professional editing and retouching to ensure your photos look perfect.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-800 mb-2">
                      Experienced Photographer
                    </h3>
                    <p className="text-dark-600">
                      Years of experience in event photography with a keen eye for capturing authentic moments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-800 mb-2">
                      Personalized Service
                    </h3>
                    <p className="text-dark-600">
                      Tailored photography packages to meet your specific needs and preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Camera className="h-20 w-20 text-white mx-auto" />
                  <p className="text-white text-xl font-medium">
                    Professional Photography
                  </p>
                  <p className="text-primary-100">
                    Every moment deserves to be captured beautifully
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-dark-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Capture Your Special Moments?
          </h2>
          <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s work together to create beautiful memories that will last a lifetime. 
            Get in touch to discuss your photography needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center justify-center"
            >
              Get in Touch
            </Link>
            <Link
              to="/gallery"
              className="btn-secondary inline-flex items-center justify-center"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 