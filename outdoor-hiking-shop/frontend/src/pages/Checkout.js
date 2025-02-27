import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getShippingMethods } from '../services/shippingService';
import { createPayment } from '../services/paymentService';

const Checkout = () => {
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    const fetchShippingMethods = async () => {
      const methods = await getShippingMethods();
      setShippingMethods(methods);
      setSelectedShipping(methods[0]?.id || '');
    };

    fetchShippingMethods();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const userId = localStorage.getItem('user_id'); // retrieve user_id from localStorage
      if (!userId) {
        alert('Please log in before placing an order');
        return;
      }

      const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const status = 'Pending';

      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId, // Include user_id in the request body
          total,
          status,
          shipping_method_id: selectedShipping, // Include shipping method
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.orderId;

      // Send order items to the backend to create order items
      for (const item of cartItems) {
        await fetch('http://localhost:5000/api/order-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          }),
        });
      }

      // Create payment after order items are created
      await createPayment(orderId, paymentMethod, 'Pending');

      alert('Order placed successfully!');
      setCartItems([]); // Clear the cart
      navigate('/products');
    } catch (error) {
      console.error('Order Placement Error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Shipping Method</h2>
        <select
          className="border rounded p-2 w-full"
          value={selectedShipping}
          onChange={(e) => setSelectedShipping(e.target.value)}
        >
          {shippingMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.method_name} - ${method.cost} (Delivery: {method.estimated_delivery})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Payment Method</h2>
        <select
          className="border rounded p-2 w-full"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
