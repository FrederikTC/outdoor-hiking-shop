import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Ensure this is imported for Tailwind styles
import App from './App';
import { CartProvider } from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CartProvider>
      <App />
    </CartProvider>
);
