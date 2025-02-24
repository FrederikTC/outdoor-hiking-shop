// src/pages/ProductDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BackButton from '../components/ui/Backbutton';
import ReviewList from '../components/ui/ReviewList';
import ReviewFormModal from '../components/ui/ReviewFormModal';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/product/${id}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  // Refresh reviews after submitting
  const refreshReviews = () => {
    fetch(`http://localhost:5000/api/reviews/product/${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-16">
      <BackButton className="mb-4" />

      <div className="flex items-center">
        <img src={product.image_url} alt={product.name} className="w-1/2 object-cover rounded-md" />
        <div className="ml-8">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price}</p>
          <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Customer Reviews */}
      <ReviewList reviews={reviews} />

      {/* Write a Review as Modal */}
      <ReviewFormModal productId={id} onReviewSubmit={refreshReviews} />
    </div>
  );
};

export default ProductDetails;
