import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Shop All Products</h1>

      {/* Display Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={`/category/${category.id}`} 
            className="bg-cover bg-center h-48 flex items-center justify-center text-white text-2xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundImage: `url(/images/category-${category.name.toLowerCase()}.jpg)` }}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
