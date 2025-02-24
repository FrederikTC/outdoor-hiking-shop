import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, image, name, price }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover rounded-md" 
      />
      <h3 className="text-xl font-bold mt-4">{name}</h3>
      <p className="text-gray-600 mt-2">${price}</p>
      <Link 
        to={`/products/${id}`} 
        className="block bg-green-500 hover:bg-green-600 text-white text-center mt-4 py-2 rounded"
      >
        View Product
      </Link>
    </div>
  );
};

export default ProductCard;
