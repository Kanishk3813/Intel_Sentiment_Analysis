import React from 'react';
import ReviewList from './ReviewList';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const RecentlyAnalyzedData = ({ recentAnalyses, recentCurrentPage, reviewsPerPage, paginateRecent, goBack, clearRecentData }) => {
  const combinedRecentReviews = recentAnalyses.flatMap(analysis => analysis.reviews);

  const handleClearRecentData = async () => {
    try {
      await axios.post('http://localhost:5000/recent/clear');
      clearRecentData();
    } catch (error) {
      console.error("There was an error clearing the recent analyses!", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10"
      style={{ backgroundImage: `url(/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <div className="flex justify-between mb-4">
          <button
            onClick={goBack}
            className="text-gray-700 hover:text-gray-900 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button
            onClick={handleClearRecentData}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Recent Data
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">Recently Analyzed Data</h2>
        <ReviewList
          reviews={combinedRecentReviews}
          currentPage={recentCurrentPage}
          reviewsPerPage={reviewsPerPage}
          totalReviews={combinedRecentReviews.length}
          paginate={paginateRecent}
          showProductName={true}
        />
      </div>
    </div>
  );
};

export default RecentlyAnalyzedData;
