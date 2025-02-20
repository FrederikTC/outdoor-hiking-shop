import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, price: Number(product.price), quantity: 1 }];
      }
    });
  };

  const removeOneFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: item.quantity - 1
          };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeOneFromCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
