import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Create a unique identifier for the item including size and color variants
      const itemKey = `${product._id}-${product.selectedSize || 'no-size'}-${product.selectedColor || 'no-color'}`;
      
      // Find existing item with same product ID, size, and color
      const existingItem = prev.find(item => {
        const existingKey = `${item._id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
        return existingKey === itemKey;
      });
      
      if (existingItem) {
        // If item with same variants exists, increase quantity
        return prev.map(item => {
          const existingKey = `${item._id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
          return existingKey === itemKey
            ? { ...item, quantity: item.quantity + (product.selectedQuantity || 1) }
            : item;
        });
      }
      
      // If no existing item with same variants, add as new item
      return [...prev, { 
        ...product, 
        quantity: product.selectedQuantity || 1,
        cartItemKey: itemKey // Store the unique key for future reference
      }];
    });
  };

  const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
    setCartItems(prev => {
      if (selectedSize !== null || selectedColor !== null) {
        // Remove specific variant
        const itemKey = `${productId}-${selectedSize || 'no-size'}-${selectedColor || 'no-color'}`;
        return prev.filter(item => {
          const existingKey = `${item._id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
          return existingKey !== itemKey;
        });
      }
      // Fallback: remove by product ID only (for backward compatibility)
      return prev.filter(item => item._id !== productId);
    });
  };

  const updateQuantity = (productId, quantity, selectedSize = null, selectedColor = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item => {
        if (selectedSize !== null || selectedColor !== null) {
          // Update specific variant
          const itemKey = `${productId}-${selectedSize || 'no-size'}-${selectedColor || 'no-color'}`;
          const existingKey = `${item._id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
          return existingKey === itemKey
            ? { ...item, quantity }
            : item;
        }
        // Fallback: update by product ID only (for backward compatibility)
        return item._id === productId
          ? { ...item, quantity }
          : item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const itemCount = getCartItemsCount();

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
