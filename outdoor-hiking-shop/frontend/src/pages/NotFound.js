import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
