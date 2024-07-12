import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const PastTrends = () => {
  const [trends, setTrends] = useState([]);
  const [filteredTrends, setFilteredTrends] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sentiment, setSentiment] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get('http://localhost:5001/past-trends'); // Note the port 5001
        setTrends(response.data);
        setFilteredTrends(response.data);
      } catch (error) {
        console.error("There was an error fetching the past trends!", error);
      }
    };

    fetchTrends();
  }, []);

  const handleFilter = () => {
    console.log("Filtering trends with the following criteria:");
    console.log("Selected Product:", selectedProduct);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Sentiment:", sentiment);

    let filtered = trends;

    if (selectedProduct) {
      filtered = filtered.filter(trend => trend.product === selectedProduct);
      console.log("Filtered by product:", filtered);
    }

    if (startDate) {
      filtered = filtered.map(trend => ({
        ...trend,
        dates: trend.dates.filter(date => new Date(date) >= new Date(startDate)),
        reviews: trend.reviews.filter((_, i) => new Date(trend.dates[i]) >= new Date(startDate))
      }));
      console.log("Filtered by start date:", filtered);
    }

    if (endDate) {
      filtered = filtered.map(trend => ({
        ...trend,
        dates: trend.dates.filter(date => new Date(date) <= new Date(endDate)),
        reviews: trend.reviews.filter((_, i) => new Date(trend.dates[i]) <= new Date(endDate))
      }));
      console.log("Filtered by end date:", filtered);
    }

    if (sentiment !== 'all') {
      filtered = filtered.map(trend => {
        const sentimentIndexes = trend.reviews.map((review, index) => {
          const sentimentType = trend.sentiments.positive > index ? 'positive' :
                                trend.sentiments.neutral > index ? 'neutral' : 'negative';
          return sentimentType === sentiment ? index : -1;
        }).filter(index => index !== -1);

        return {
          ...trend,
          dates: sentimentIndexes.map(index => trend.dates[index]),
          reviews: sentimentIndexes.map(index => trend.reviews[index])
        };
      });
      console.log("Filtered by sentiment:", filtered);
    }

    setFilteredTrends(filtered);
    console.log("Filtered Trends:", filtered);
  };

  const renderCharts = () => {
    return filteredTrends.map((trend, index) => {
      const dateSentimentMap = trend.dates.reduce((acc, date, i) => {
        const sentiment = trend.sentiments.positive > i ? 'positive' :
                          trend.sentiments.neutral > i ? 'neutral' : 'negative';
        if (!acc[date]) acc[date] = { positive: 0, neutral: 0, negative: 0 };
        acc[date][sentiment]++;
        return acc;
      }, {});

      const dates = Object.keys(dateSentimentMap);
      const positiveCounts = dates.map(date => dateSentimentMap[date].positive);
      const neutralCounts = dates.map(date => dateSentimentMap[date].neutral);
      const negativeCounts = dates.map(date => dateSentimentMap[date].negative);

      return (
        <div key={index} className="p-4 border border-gray-300 rounded mb-4">
          <h2 className="text-xl font-bold mb-2">{trend.product}</h2>
          <Bar
            data={{
              labels: dates,
              datasets: [
                {
                  label: 'Number of Reviews',
                  data: trend.reviews.map((_, i) => i + 1),  // Simulating review counts
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
                }
              ]
            }}
            options={{ responsive: true }}
          />
          <Line
            data={{
              labels: dates,
              datasets: [
                {
                  label: 'Positive Sentiment',
                  data: positiveCounts,
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  fill: false
                },
                {
                  label: 'Neutral Sentiment',
                  data: neutralCounts,
                  backgroundColor: 'rgba(255, 206, 86, 0.6)',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  fill: false
                },
                {
                  label: 'Negative Sentiment',
                  data: negativeCounts,
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  fill: false
                }
              ]
            }}
            options={{ responsive: true }}
          />
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10" style={{ backgroundImage: `url(/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <button
          onClick={() => navigate('/')}
          className="text-gray-700 hover:text-gray-900 mb-4 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
        <h1 className="text-3xl font-bold text-center mb-8">Past Trends</h1>
        <div className="flex flex-col space-y-4 mb-8">
          <div>
            <label className="block mb-2">Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">All Products</option>
              {trends.map((trend, index) => (
                <option key={index} value={trend.product}>{trend.product}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Sentiment</label>
            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="all">All</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Filter Trends
          </button>
        </div>
        <div>
          {renderCharts()}
        </div>
      </div>
    </div>
  );
};

export default PastTrends;
