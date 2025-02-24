import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-2xl font-bold">
          Hiking Webshop
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/products" className="hover:text-gray-400">
              Products
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-gray-400">
              Cart
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/checkout" className="hover:text-gray-400">
                  Checkout
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
