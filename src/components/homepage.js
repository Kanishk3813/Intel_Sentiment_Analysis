import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../src/fonts.css';
import Footer from './footer';

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToAnalyzer = () => {
    navigate('/analyze');
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col justify-center" 
      style={{ backgroundImage: `url(/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 opacity-70"></div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl p-4" style={{ fontFamily: 'Benett' }}>
          <div className="text-left text-white max-w-lg lg:mr-48 mb-8 lg:mb-0">
            <h1 className="text-5xl lg:text-7xl font-bold mb-4">Effortless Review Analysis</h1>
            <p className="text-lg lg:text-2xl mb-4 text-white">Transform your understanding of product reviews with our state-of-the-art sentiment analysis. Easily identify key sentiments and trends in customer feedback.</p>
          </div>
          <div className="flex justify-center">
            <img src="/home-gif.gif" alt="Loading GIF" className="w-64 lg:w-96 h-64 lg:h-96" />
          </div>
        </div>
        <button
          onClick={navigateToAnalyzer}
          className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transform transition duration-300 hover:scale-105 mt-4"
        >
          Try it out now
        </button>
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
