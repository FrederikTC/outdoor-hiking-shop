import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cover bg-center h-96" style={{ backgroundImage: "url('/images/hero-image.jpg')" }}>
        <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-bold mb-4">Explore the Outdoors</h1>
          <p className="text-xl mb-6">Discover the best hiking gear and equipment</p>
          <Link to="/products" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <h2 className="text-3xl text-center font-bold mb-8">Featured Products</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <img src="/images/product-backpack.jpg" alt="Hiking Backpack" className="w-full h-48 object-cover rounded-md" />
            <h3 className="text-xl font-bold mt-4">Hiking Backpack</h3>
            <p className="text-gray-600 mt-2">$99.99</p>
            <Link to="/products/1" className="block bg-green-500 hover:bg-green-600 text-white text-center mt-4 py-2 rounded">
              View Product
            </Link>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <img src="/images/product-tent.jpg" alt="Camping Tent" className="w-full h-48 object-cover rounded-md" />
            <h3 className="text-xl font-bold mt-4">Camping Tent</h3>
            <p className="text-gray-600 mt-2">$149.99</p>
            <Link to="/products/2" className="block bg-green-500 hover:bg-green-600 text-white text-center mt-4 py-2 rounded">
              View Product
            </Link>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <img src="/images/product-boots.jpg" alt="Hiking Boots" className="w-full h-48 object-cover rounded-md" />
            <h3 className="text-xl font-bold mt-4">Hiking Boots</h3>
            <p className="text-gray-600 mt-2">$89.99</p>
            <Link to="/products/3" className="block bg-green-500 hover:bg-green-600 text-white text-center mt-4 py-2 rounded">
              View Product
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-3xl text-center font-bold mb-8">Explore Categories</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/products?category=backpacks" className="bg-cover bg-center h-48 flex items-center justify-center text-white text-2xl font-bold rounded-lg" style={{ backgroundImage: "url('/images/category-backpacks.jpg')" }}>
            Backpacks
          </Link>
          <Link to="/products?category=tents" className="bg-cover bg-center h-48 flex items-center justify-center text-white text-2xl font-bold rounded-lg" style={{ backgroundImage: "url('/images/category-tents.jpg')" }}>
            Tents
          </Link>
          <Link to="/products?category=boots" className="bg-cover bg-center h-48 flex items-center justify-center text-white text-2xl font-bold rounded-lg" style={{ backgroundImage: "url('/images/category-boots.jpg')" }}>
            Boots
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
