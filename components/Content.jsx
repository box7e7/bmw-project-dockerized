import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faKey, faWrench, faCar, faClock, faBolt, faUserTie } from '@fortawesome/free-solid-svg-icons';

const ServiceCard = ({ icon, title, description, isPopular }) => (
  <div className="group relative h-[200px] hover:-translate-y-1 transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
      {isPopular && (
        <div className="absolute -top-4 right-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
            Popular
          </div>
        </div>
      )}
      <div className="absolute top-0 left-0 w-full">
        <div className="relative -top-4 mx-auto w-12 h-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={icon} className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      <div className="h-full flex flex-col justify-center items-center pt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 text-base leading-relaxed text-center">{description}</p>
      </div>
    </div>
  </div>
);

const FeatureBlock = ({ icon, title, description }) => (
  <div className="h-[200px] transform hover:-translate-y-1 transition-all duration-300">
    <div className="relative bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 h-full flex flex-col">
      <div className="absolute top-0 left-0 w-full">
        <div className="relative -top-4 mx-auto w-12 h-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={icon} className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      <div className="mt-6 text-center flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 text-base leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const Content = () => {
  const services = [
    {
      icon: faTruck,
      title: "Towing Service",
      description: "24/7 professional towing service for all vehicle types. Fast response time and careful handling of your vehicle.",
      isPopular: true
    },
    {
      icon: faKey,
      title: "Lockout Service",
      description: "Locked out of your vehicle? Our skilled technicians can help you regain access quickly and safely.",
      isPopular: false
    },
    {
      icon: faWrench,
      title: "Jump Start",
      description: "Dead battery? We'll get you back on the road with our professional jump start service.",
      isPopular: true
    },
    {
      icon: faCar,
      title: "Tire Change",
      description: "Flat tire? We'll replace it with your spare or help you find a solution to get you moving again.",
      isPopular: false
    }
  ];

  const features = [
    {
      icon: faClock,
      title: "24/7 Service",
      description: "Available around the clock for emergencies"
    },
    {
      icon: faBolt,
      title: "Fast Response",
      description: "Quick arrival to your location"
    },
    {
      icon: faUserTie,
      title: "Professional Team",
      description: "Experienced and certified technicians"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Professional Towing & Roadside Services
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Available 24/7 for all your roadside assistance needs. Fast, reliable, and professional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="/api/auth/login"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
          >
            <span>Login to Get Started</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index}>
              <FeatureBlock {...feature} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
