import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-cover bg-center h-96" style={{ backgroundImage: "url('/images/hero-image.jpg')" }}>
      <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center text-white">
        <h1 className="text-5xl font-bold mb-4">Explore the Outdoors</h1>
        <p className="text-xl mb-6">Discover the best hiking gear and equipment</p>
        <Link to="/products" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
