import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeOneFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const isAuthenticated = localStorage.getItem('token');
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="flex items-center mb-4 shadow-lg rounded-lg p-4 bg-white">
            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="ml-4">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p>${item.price.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              <button
                onClick={() => removeOneFromCart(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Remove One
              </button>
            </div>
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <button
          onClick={handleCheckout}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-6"
        >
          Checkout
        </button>
      )}
    </div>
  );
};

export default Cart;
