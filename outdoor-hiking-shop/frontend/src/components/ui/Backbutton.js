import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react'; // Optional icon for better UX

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // Navigate to the previous page
      className={`flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none ${className}`}
    >
      <ArrowLeftIcon />
      Back
    </button>
  );
};

export default BackButton;
