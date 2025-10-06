import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Cloud, 
  Brain, 
  Server, 
  Layers, 
  Snowflake,
  Linkedin,
  Camera,
  Dumbbell,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Github
} from 'lucide-react';

const BehindProfile: React.FC = () => {
  const technicalInterests = [
    {
      title: 'Data Engineering',
      icon: Database,
      description: 'Building robust data pipelines and ETL processes',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Data Warehousing',
      icon: Server,
      description: 'Designing scalable data storage solutions',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Data Science',
      icon: Brain,
      description: 'Extracting insights from complex datasets',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Generative AI',
      icon: Brain,
      description: 'Exploring AI-powered applications and solutions',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Cloud Platforms',
      icon: Cloud,
      description: 'AWS, Snowflake, and modern cloud architectures',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Scalable Architecture',
      icon: Layers,
      description: 'Designing systems that grow with business needs',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const personalPassions = [
    {
      title: 'Photography',
      emoji: '📷',
      description: 'I love capturing candid moments and stories through my lens. I run a separate photography portfolio.',
      ctaText: 'View Photography Website',
      ctaLink: 'https://www.instagram.com/sugunstories/',
      color: 'from-gray-600 to-gray-800'
    },
    {
      title: 'Weightlifting',
      emoji: '🏋️‍♂️',
      description: 'Fitness and discipline are essential to my lifestyle. Weightlifting keeps me grounded.',
      color: 'from-red-600 to-red-800'
    },
    {
      title: 'Travel & Adventure',
      emoji: '🌍',
      description: 'Exploring new places and cultures fuels both my creativity and perspective.',
      color: 'from-green-600 to-green-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/gallery"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Projects
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Beyond the Resume
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Explore my interests, values, and passions beyond the technical portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Interests Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Areas of Interest in Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What drives my curiosity and learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalInterests.map((interest, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${interest.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <interest.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {interest.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {interest.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LinkedIn Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Linkedin className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                All Projects & Certifications
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                All my projects and certificates are documented on LinkedIn with demo links and case studies.
              </p>
              <a
                href="https://www.linkedin.com/in/sai-sugun-ravipalli/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>🔗 View on LinkedIn</span>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Passions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Who I Am Outside the Screen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passions and interests that shape who I am beyond my professional work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {personalPassions.map((passion, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{passion.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {passion.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {passion.description}
                  </p>
                  {passion.ctaText && passion.ctaLink && (
                    <a
                      href={passion.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl"
                    >
                      <span>{passion.ctaText}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Connect
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Interested in collaborating or learning more about my work? I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              Get in Touch
            </Link>
            <Link
              to="/gallery"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all inline-flex items-center justify-center"
            >
              View Projects
            </Link>
          </div>
          
          {/* Professional Links */}
          <div className="mt-12 flex justify-center space-x-6">
            <a 
              href="https://github.com/saisugunravipalli" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              title="GitHub Profile"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/sai-sugun-ravipalli/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              title="LinkedIn Profile"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BehindProfile;

