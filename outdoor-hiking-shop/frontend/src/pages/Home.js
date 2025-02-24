import React, { useState, useEffect } from 'react';
import HeroSection from '../components/ui/HeroSection';
import ProductCard from '../components/ui/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetching featured products from the new endpoint
        const response = await fetch('http://localhost:5000/api/products/featured');
        const products = await response.json();
        console.log('Fetched Featured Products:', products);

        setFeaturedProducts(products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Failed to load featured products. Please try again.');
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) return <div>Loading Featured Products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-16">
        <h2 className="text-3xl text-center font-bold mb-8">Featured Products</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image_url}
                name={product.name}
                price={product.price}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No featured products available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
