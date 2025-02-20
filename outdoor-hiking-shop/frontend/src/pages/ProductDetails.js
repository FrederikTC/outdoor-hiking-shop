import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-16">
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
          <div className="mt-4">
          <Link 
  to="/products" 
  className="inline-block text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-2 mb-4"
>
  ← Back to Products
</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
