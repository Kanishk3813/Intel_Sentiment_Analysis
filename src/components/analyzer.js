import React, { useState } from 'react';
import axios from 'axios';
import ReviewList from './ReviewList';
import ProductDetails from './productdetails';
import ClipLoader from 'react-spinners/ClipLoader';
import EDA from './eda';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RecentlyAnalyzedData from './storedata';

function AnalyzerPage() {
  const [url, setUrl] = useState('');
  const [product, setProduct] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [recentCurrentPage, setRecentCurrentPage] = useState(1);
  const [showRecentData, setShowRecentData] = useState(false);
  const [maxReviews, setMaxReviews] = useState(25);
  const [wordcloudImage, setWordcloudImage] = useState(null);
  const [sentimentType, setSentimentType] = useState('all');
  const reviewsPerPage = 5;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitted with URL:", url);
    try {
      const response = await axios.post('http://localhost:5000/extract', { url, max_reviews: maxReviews });
      console.log("Response received:", response.data);
      setProduct(response.data.product);
      setSource(response.data.source);
      setReviews(response.data.reviews);
      setCurrentPage(1);
    } catch (error) {
      console.error("There was an error extracting the reviews!", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJSON = async () => {
    try {
      const response = await axios.post('http://localhost:5000/download_json', { reviews }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reviews.json');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("There was an error downloading the JSON file!", error);
    }
  };

  const handleFetchRecentAnalyses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/recent');
      setRecentAnalyses(response.data);
      setRecentCurrentPage(1);
      setShowRecentData(true);
    } catch (error) {
      console.error("There was an error fetching the recent analyses!", error);
    }
  };

  const handleClearRecentData = () => {
    setRecentAnalyses([]);
  };

  const handleGenerateWordcloud = async (sentimentType) => {
    try {
      const response = await axios.post('http://localhost:5000/generate_wordcloud', { reviews, sentiment_type: sentimentType }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setWordcloudImage(url);
    } catch (error) {
      console.error("There was an error generating the word cloud!", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateRecent = (pageNumber) => setRecentCurrentPage(pageNumber);

  return (
    <>
      {showRecentData ? (
        <RecentlyAnalyzedData
          recentAnalyses={recentAnalyses}
          recentCurrentPage={recentCurrentPage}
          reviewsPerPage={reviewsPerPage}
          paginateRecent={paginateRecent}
          goBack={() => setShowRecentData(false)}
          clearRecentData={handleClearRecentData}
        />
      ) : (
        <div className="min-h-screen bg-gray-100 py-10"
          style={{ backgroundImage: `url(/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-gray-900 mb-4 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <button
                onClick={handleFetchRecentAnalyses}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-end"
              >
                Recently Analyzed Data
              </button>
            </div>
            <h1 className="text-3xl font-bold text-center mb-8">
              <FaSearch className="inline-block mr-2" /> Review Analyzer
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                className="p-2 border border-gray-300 rounded"
              />
              <select
                value={maxReviews}
                onChange={(e) => setMaxReviews(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded"
              >
                <option value={25}>25 reviews</option>
                <option value={50}>50 reviews</option>
                <option value={75}>75 reviews</option>
                <option value={100}>100 reviews</option>
              </select>
              <button type="submit" className={`px-4 py-2 text-white rounded ${url ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}`} 
                disabled={!url}>
                Extract and Analyze
              </button>
            </form>
            {loading ? (
              <div className="flex justify-center items-center mt-5">
                <ClipLoader color="#4fa94d" loading={loading} size={50} />
              </div>
            ) : (
              <>
                {source && <p className="text-center mt-4">Source: {source}</p>}
                {product && <ProductDetails product={product} />}
                {reviews.length > 0 && (
                  <>
                    <ReviewList
                      reviews={reviews}
                      currentPage={currentPage}
                      reviewsPerPage={reviewsPerPage}
                      totalReviews={reviews.length}
                      paginate={paginate}
                      showProductName={false}
                    />
                    <EDA reviews={reviews} />
                    <div className="flex justify-center mt-4 space-x-4">
                      <button
                        onClick={() => handleGenerateWordcloud('all')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Generate Wordcloud (All)
                      </button>
                      <button
                        onClick={() => handleGenerateWordcloud('positive')}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Generate Wordcloud (Positive)
                      </button>
                      <button
                        onClick={() => handleGenerateWordcloud('neutral')}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Generate Wordcloud (Neutral)
                      </button>
                      <button
                        onClick={() => handleGenerateWordcloud('negative')}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Generate Wordcloud (Negative)
                      </button>
                    </div>
                    {wordcloudImage && (
                      <div className="flex justify-center mt-4">
                        <img src={wordcloudImage} alt="Wordcloud" className="w-full h-auto" />
                      </div>
                    )}
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleDownloadJSON}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Download JSON
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          {/* <Footer />  */}
        </div>
      )}
    </>
  );
}

export default AnalyzerPage;