import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const EDA = ({ reviews }) => {
  // Extracting the dates and sentiments for trend analysis
  const dates = reviews.map(review => review.date);
  const sentiments = reviews.map(review => review.sentiment);

  const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
  sentiments.forEach(sentiment => {
    sentimentCounts[sentiment]++;
  });

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Sentiment Over Time',
        data: sentiments.map((sentiment) => {
          if (sentiment === 'Positive') return 1;
          if (sentiment === 'Neutral') return 0;
          return -1;
        }),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1,
      }
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (value === 1) return 'Positive';
            if (value === 0) return 'Neutral';
            return 'Negative';
          }
        }
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">Exploratory Data Analysis (EDA)</h2>
      <div className="max-w-3xl mx-auto">
        <Line data={data} options={options} />
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Sentiment Distribution</h3>
        <div className="flex justify-around mt-4">
          <div className="flex flex-col items-center">
            <div className="text-green-500 font-bold text-2xl">{sentimentCounts.Positive}</div>
            <div>Positive</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-gray-500 font-bold text-2xl">{sentimentCounts.Neutral}</div>
            <div>Neutral</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-red-500 font-bold text-2xl">{sentimentCounts.Negative}</div>
            <div>Negative</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDA;
