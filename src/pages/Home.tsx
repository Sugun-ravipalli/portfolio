import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase-de';
import ImageSlideshow from '../components/ImageSlideshow';
import HomepageEditor from '../components/HomepageEditor';
import InteractiveMedallionDiagram from '../components/InteractiveMedallionDiagram';
import { Database, Code, Cloud, Award, ArrowRight, Play, Github, Linkedin, Edit3, GraduationCap, Briefcase, FileText, ExternalLink, Star, Heart, Users, Calendar, Camera, Instagram } from 'lucide-react';

const Home: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [content, setContent] = useState({
    heroTitle: "Sai Sugun Ravipalli",
    heroSubtitle: "Senior Data Engineer | Delivering scalable data solutions that drive business growth and operational excellence across healthcare, technology, and enterprise environments.",
    slideshowTitle: "Featured Data Engineering Projects",
    slideshowSubtitle: "Real-world implementations showcasing end-to-end data pipeline development, cloud architecture, and business impact.",
    servicesTitle: "Core Technical Competencies",
    servicesSubtitle: "Proven expertise in modern data engineering stack with hands-on experience in production environments.",
    statsTitle: "Professional Impact",
    statsSubtitle: "Delivering measurable business value through innovative data engineering solutions and scalable architectures.",
    whyChooseTitle: "Why Hire Me",
    whyChooseSubtitle: "Combining deep technical expertise with business acumen to deliver data solutions that drive real results",
    ctaTitle: "Ready to Discuss Your Data Engineering Needs?",
    ctaSubtitle: "Let's explore how my expertise in data engineering, cloud platforms, and scalable architectures can contribute to your team's success. I'm excited to discuss opportunities and share how I can add immediate value to your organization."
  });

  const dataLayers = [
    {
      icon: GraduationCap,
      title: 'Bronze Layer - Education & Foundations',
      description: 'Academic foundation and core courses that built my data engineering expertise.',
      features: ['MS Business Analytics - UT Dallas', 'B.Tech Petroleum Engineering - JNTU', 'Database Systems', 'Big Data Analytics', 'Applied Machine Learning'],
      color: 'from-amber-600 to-orange-600',
      layer: 'bronze'
    },
    {
      icon: Award,
      title: 'Silver Layer - Certifications & Skills',
      description: 'Professional certifications and technical skills that validate my expertise.',
      features: ['SnowPro Core Certified', 'AWS Cloud Practitioner', 'SQL Oracle', 'Python & R', 'Salesforce & Snowflake'],
      color: 'from-gray-400 to-gray-600',
      layer: 'silver'
    },
    {
      icon: Briefcase,
      title: 'Gold Layer - Professional Experience',
      description: 'Real-world experience building scalable data solutions and leading technical projects.',
      features: ['Data Engineer - Solomo.io', 'ETL Developer - Tech Mahindra', 'Streamlit RAG Applications', 'Salesforce Pipelines', 'CDC & Reverse ETL'],
      color: 'from-yellow-500 to-yellow-600',
      layer: 'gold'
    },
    {
      icon: Database,
      title: 'Presentation Layer - Offerings & Solutions',
      description: 'Comprehensive data engineering services and innovative solutions for modern businesses.',
      features: ['Salesforce Implementations', 'Snowflake Data Pipelines', 'Streamlit Dashboards', 'Agentic AI Applications', 'Cloud Architecture'],
      color: 'from-blue-500 to-indigo-600',
      layer: 'presentation'
    }
  ];

  const stats = [
    { number: '5+', label: 'Years Data Engineering Experience' },
    { number: '50+', label: 'Production Pipelines Deployed' },
    { number: '10+', label: 'Industry Certifications' },
    { number: '100%', label: 'Project Success Rate' }
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
      <section className="relative bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white overflow-hidden">
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
                <Database className="h-10 w-10 text-white" />
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
                className="bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center"
              >
                View My Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="https://www.linkedin.com/in/sai-sugun-ravipalli/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-800 transition-all inline-flex items-center justify-center"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                Connect on LinkedIn
              </a>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-800 transition-all inline-flex items-center justify-center"
              >
                Schedule Interview
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
            <ImageSlideshow />
          </div>
        </div>
      </section>

      {/* Interactive Medallion Architecture Section */}
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

          <InteractiveMedallionDiagram />
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

      {/* Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What I Bring to Your Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immediate value through proven expertise in modern data engineering practices and production-ready solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cloud-First Architecture</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Expert in AWS, Snowflake, and modern cloud platforms with hands-on experience building scalable, cost-effective data solutions.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• AWS Cloud Practitioner Certified</li>
                <li>• SnowPro Core Certified</li>
                <li>• Production pipeline deployment</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Production-Ready Solutions</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Proven track record of delivering enterprise-grade data pipelines with monitoring, error handling, and scalability built-in.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Healthcare data pipelines (Cedars-Sinai)</li>
                <li>• Real-time CDC implementations</li>
                <li>• Automated deployment pipelines</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Impact Focus</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Strong understanding of business requirements with ability to translate technical solutions into measurable business value.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Cross-functional collaboration</li>
                <li>• Stakeholder communication</li>
                <li>• ROI-driven development</li>
              </ul>
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
              Schedule Interview
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="https://www.linkedin.com/in/sai-sugun-ravipalli/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all inline-flex items-center justify-center"
            >
              <Linkedin className="mr-2 h-5 w-5" />
              Connect on LinkedIn
            </a>
            <a
              href="https://github.com/Sugun-ravipalli"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all inline-flex items-center justify-center"
            >
              <Github className="mr-2 h-5 w-5" />
              View GitHub
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