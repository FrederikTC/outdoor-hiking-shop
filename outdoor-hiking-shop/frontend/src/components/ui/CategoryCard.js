import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, image, name }) => {
  return (
    <Link 
      to={`/products?category=${category}`} 
      className="bg-cover bg-center h-48 flex items-center justify-center text-white text-2xl font-bold rounded-lg" 
      style={{ backgroundImage: `url('${image}')` }}
    >
      {name}
    </Link>
  );
};

export default CategoryCard;
