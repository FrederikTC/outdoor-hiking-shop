import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Category = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate(); // New: Use navigate hook

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get(`http://localhost:5000/api/products/category/${id}`);
        setProducts(productsResponse.data);

        // Get category name
        const categoryResponse = await axios.get(`http://localhost:5000/api/categories/${id}`);
        setCategoryName(categoryResponse.data.name);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [id]);

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-8">{categoryName}</h1>

      {/* Back Button */}
      <button 
  onClick={() => navigate(-1)} 
  className="inline-block text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-2 mb-4"
>
  ← Back
</button>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded-md" 
            />
            <h3 className="text-xl font-bold mt-4">{product.name}</h3>
            <p className="text-gray-600 mt-2">${product.price}</p>
            <Link 
              to={`/products/${product.id}`} 
              className="block bg-green-500 hover:bg-green-600 text-white text-center mt-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
