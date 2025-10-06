import React, { useState, useEffect } from 'react';
import { Database, ArrowRight, BarChart3, FileText, Brain, Zap, Filter, CheckCircle, GraduationCap, Award, Briefcase, Layers, Globe, Users, BookOpen, Code, Cloud, GitBranch, ExternalLink } from 'lucide-react';

interface LayerData {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<any>;
  features: string[];
  dataFlow: string;
}

const InteractiveMedallionDiagram: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  const layers: LayerData[] = [
    {
      id: 'sources',
      name: 'SOURCE SYSTEMS',
      description: 'Inputs & Origins',
      color: 'from-blue-500 to-cyan-600',
      icon: Database,
      features: [
        '🎓 Education: MS Business Analytics - UT Dallas',
        '📚 Coursework: Data Warehousing, Cloud Computing, ML',
        '📜 Certifications: SnowPro Core, AWS Cloud Practitioner',
        '💼 Internships: Cedars-Sinai, Solomo.io',
        '👨‍🏫 Mentorship: Dan Kauppi, industry experts'
      ],
      dataFlow: 'The foundation of my data engineering journey'
    },
    {
      id: 'bronze',
      name: 'BRONZE LAYER',
      description: 'Raw Learning & Exposure',
      color: 'from-amber-500 to-orange-600',
      icon: BookOpen,
      features: [
        '🐍 First exposure to Python, SQL, Excel',
        '🔬 Early academic projects & coursework experiments',
        '☁️ Exploration of Snowflake, Salesforce, AWS',
        '📊 Data visualization with Tableau, Power BI',
        '🧪 Experimental data analysis and modeling'
      ],
      dataFlow: 'Raw, unrefined learning and tool exploration'
    },
    {
      id: 'silver',
      name: 'SILVER LAYER',
      description: 'Refined Projects & Use Cases',
      color: 'from-gray-400 to-gray-600',
      icon: Code,
      features: [
        '🏥 Snowflake pipelines for healthcare data',
        '🗺️ Geocoding pipeline using Snowpark & UDTFs',
        '📈 Streamlit dashboards for Practice Loyalty',
        '🔄 Salesforce reverse ETL orchestration',
        '📁 Clean code repos with structured directories'
      ],
      dataFlow: 'Semi-structured insights and refined implementations'
    },
    {
      id: 'gold',
      name: 'GOLD LAYER',
      description: 'Business Value & Production',
      color: 'from-yellow-400 to-yellow-600',
      icon: Award,
      features: [
        '🏥 Production pipelines in healthcare (Cedars/RadNet)',
        '📊 Dynamic tables with change tracking',
        '🤝 Handoff to Salesforce with clean data models',
        '☁️ Automated EC2-hosted Streamlit apps',
        '🚀 GitOps and deployment-ready artifacts'
      ],
      dataFlow: 'Fully curated data adding real business value'
    },
    {
      id: 'presentation',
      name: 'PRESENTATION LAYER',
      description: 'Sharing With The World',
      color: 'from-purple-500 to-indigo-600',
      icon: Globe,
      features: [
        '💻 GitHub repositories & open source contributions',
        '🌐 Portfolio websites (photography & professional)',
        '💼 LinkedIn articles and professional posts',
        '🎤 Public talks (Snowflake Summit, DFW User Groups)',
        '📝 Medium/Notion writeups and blog content'
      ],
      dataFlow: 'Storytelling layer - how others experience your work'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">📊 My Professional Journey – A Medallion Architecture</h2>
        <p className="text-xl text-gray-600">From foundational learning to senior-level expertise, demonstrating systematic career progression and technical mastery</p>
      </div>

      {/* Main Pipeline - Clean Horizontal Layout */}
      <div className="relative">
        {/* Background Flow Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-amber-200 via-gray-200 via-yellow-200 to-purple-200 transform -translate-y-1/2 rounded-full"></div>
        
        {/* Layers */}
        <div className="relative flex items-center justify-center py-12 gap-4">
          {layers.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <div
                className={`relative bg-gradient-to-br ${layer.color} rounded-2xl p-6 cursor-pointer transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 shadow-xl ${
                  activeLayer === layer.id ? 'ring-4 ring-white ring-opacity-30 scale-110 -translate-y-2' : ''
                } ${animationStep === index ? 'animate-pulse' : ''}`}
                onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                style={{ minWidth: '200px', maxWidth: '220px' }}
              >
                {/* Layer Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-gray-800">{index + 1}</span>
                </div>
                
                <div className="text-white text-center">
                  <div className="text-xl font-bold mb-3">{layer.name}</div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <layer.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-sm font-medium leading-relaxed">{layer.description}</div>
                </div>
              </div>
              
              {/* Arrow between layers */}
              {index < layers.length - 1 && (
                <div className="flex-shrink-0">
                  <ArrowRight className="h-6 w-6 text-gray-400 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Layer Details */}
      {activeLayer && (
        <div className="mt-12 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {(() => {
            const layer = layers.find(l => l.id === activeLayer);
            if (!layer) return null;
            
            return (
              <div className="animate-fadeIn">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`bg-gradient-to-br ${layer.color} rounded-xl p-3 shadow-lg`}>
                    <layer.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{layer.name} Layer</h3>
                    <p className="text-gray-600 text-lg">{layer.dataFlow}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Key Components & Achievements
                    </h4>
                    <ul className="space-y-3">
                      {layer.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Layer Purpose & Impact
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">{layer.dataFlow}</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 italic">
                        {layer.id === 'sources' && "This layer represents the foundational inputs that started my data engineering journey - education, certifications, and early professional experiences."}
                        {layer.id === 'bronze' && "Raw, unrefined learning where I first explored tools and concepts without structure - the experimental phase of my development."}
                        {layer.id === 'silver' && "Semi-structured projects where I began applying learned concepts in more organized, purposeful ways with cleaner implementations."}
                        {layer.id === 'gold' && "Production-ready solutions that deliver real business value - the culmination of refined skills and experience."}
                        {layer.id === 'presentation' && "How I share my work with the world - the storytelling and knowledge-sharing layer of my professional journey."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Elegant Legend */}
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {layers.map((layer, index) => (
          <div key={layer.id} className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
            <div className={`w-4 h-4 bg-gradient-to-r ${layer.color} rounded-full`}></div>
            <span className="text-sm font-medium text-gray-700">{layer.description}</span>
          </div>
        ))}
      </div>

      {/* Professional CTA Section */}
      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Discuss How I Can Add Value to Your Team?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          I'm actively seeking senior data engineering opportunities where I can leverage my expertise in cloud platforms, 
          scalable architectures, and production systems to drive business impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.linkedin.com/in/sai-sugun-ravipalli/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Connect on LinkedIn</span>
            <ExternalLink className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/Sugun-ravipalli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>View GitHub Portfolio</span>
            <GitBranch className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMedallionDiagram;
