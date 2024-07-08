import React, { useEffect } from 'react';

const ReviewList = ({ reviews, currentPage, reviewsPerPage, totalReviews, paginate }) => {
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="mt-8">
      {currentReviews.map((review, index) => (
        <div key={index} className="bg-white p-6 shadow-md rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">{review.title}</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2"><strong>Author:</strong> {review.author}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Date:</strong> {review.date}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Rating:</strong> {review.rating}</p>
          </div>
          <p className="mb-4"><strong>Content:</strong> {review.content}</p>
          <p className="mb-4"><strong>Sentiment:</strong> {review.sentiment}</p>
          {review.positive_parts && (
            <p className="mb-2"><strong>Highlights:</strong> {review.positive_parts}</p>
          )}
          {review.negative_parts && (
            <p className="mb-2"><strong>Issues:</strong> {review.negative_parts}</p>
          )}
          {review.neutral_parts && (
            <p className="mb-2"><strong>Neutral Points:</strong> {review.neutral_parts}</p>
          )}
          {review.improvements.length > 0 && (
            <div className="mb-4">
              <p><strong>Suggestions for Improvement:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {review.improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mb-4">
            <p><strong>Sentiment Probabilities:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Negative: {review.probabilities.Negative}</li>
              <li>Neutral: {review.probabilities.Neutral}</li>
              <li>Positive: {review.probabilities.Positive}</li>
            </ul>
          </div>
        </div>
      ))}

      {totalReviews > reviewsPerPage && (
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastReview >= totalReviews}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
