// src/components/ui/ReviewList.js

import React from 'react';

const ReviewList = ({ reviews }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="bg-gray-100 rounded-lg p-4 mb-4">
            <h4 className="text-xl font-bold">{review.rating} / 5</h4>
            <p>{review.review_text}</p>
            <p className="text-sm text-gray-600">- {review.username}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
};

export default ReviewList;
