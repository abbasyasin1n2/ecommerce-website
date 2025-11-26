"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = "electrohub_cart";

// Helper to get cart from localStorage
function getStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    console.error("Error loading cart:", e);
    return [];
  }
}

// Helper to save cart to localStorage
function saveCart(cart) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
}

export function CartProvider({ children }) {
  // Initialize with stored cart (safe for SSR - returns [] on server)
  const [cart, setCartState] = useState(getStoredCart);
  const isInitialized = useRef(false);

  // Custom setter that also saves to localStorage
  const setCart = useCallback((updater) => {
    setCartState((prev) => {
      const newCart = typeof updater === "function" ? updater(prev) : updater;
      saveCart(newCart);
      return newCart;
    });
  }, []);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        // Update quantity if item exists
        const newCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated quantity in cart`);
        return newCart;
      } else {
        // Add new item
        toast.success(`${product.title || product.name} added to cart`);
        return [
          ...prevCart,
          {
            _id: product._id,
            title: product.title || product.name,
            price: product.price,
            imageUrl: product.imageUrl || product.image,
            brand: product.brand,
            quantity,
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i._id === productId);
      if (item) {
        toast.success(`${item.title} removed from cart`);
      }
      return prevCart.filter((item) => item._id !== productId);
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  // Calculate totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Check if item is in cart
  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cart.find((i) => i._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
