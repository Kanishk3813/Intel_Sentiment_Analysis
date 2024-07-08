// src/components/ProductDetails.js
import React from 'react';

const ProductDetails = ({ product }) => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-2">Product Details</h2>
      <p><strong>Product:</strong> {product}</p>
    </div>
  );
};

export default ProductDetails;
