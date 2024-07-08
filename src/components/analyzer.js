import React, { useState } from 'react';
import axios from 'axios';
import ReviewList from './ReviewList';
import ProductDetails from './productdetails';
import ClipLoader from 'react-spinners/ClipLoader';
import EDA from './eda';
import { FaSearch } from 'react-icons/fa';
import Footer from './footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AnalyzerPage() {
  const [url, setUrl] = useState('');
  const [product, setProduct] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitted with URL:", url);
    try {
      const response = await axios.post('http://localhost:5000/extract', { url });
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10"
      style={{ backgroundImage: `url(/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <button
            onClick={() => navigate('/')}
            className="text-gray-700 hover:text-gray-900 mb-4 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
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
                  />
                  <EDA reviews={reviews} />
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
    </>
  );
}

export default AnalyzerPage;
