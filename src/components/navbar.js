import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">Review Analyzer</Link>
          </div>
          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              <Link to="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">Home</Link>
              <Link to="/analyze" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">Analyze</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
