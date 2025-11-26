"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore } from "react";
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

// Create a simple store for cart that works with useSyncExternalStore
let cartListeners = [];
let cartSnapshot = [];

// Cached empty array for server snapshot to avoid infinite loop
const EMPTY_CART = [];

function subscribeToCart(callback) {
  cartListeners.push(callback);
  return () => {
    cartListeners = cartListeners.filter(l => l !== callback);
  };
}

function getCartSnapshot() {
  return cartSnapshot;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function updateCartSnapshot(newCart) {
  cartSnapshot = newCart;
  saveCart(newCart);
  cartListeners.forEach(listener => listener());
}

// Initialize cart on client side
if (typeof window !== "undefined") {
  cartSnapshot = getStoredCart();
}

export function CartProvider({ children }) {
  // Use useSyncExternalStore for hydration-safe cart state
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerSnapshot);

  // Helper to update cart
  const setCart = useCallback((updater) => {
    const newCart = typeof updater === "function" ? updater(cart) : updater;
    updateCartSnapshot(newCart);
  }, [cart]);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      // Update quantity if item exists
      const newCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      updateCartSnapshot(newCart);
      toast.success(`Updated quantity in cart`);
    } else {
      // Add new item
      const newCart = [
        ...cart,
        {
          _id: product._id,
          title: product.title || product.name,
          price: product.price,
          imageUrl: product.imageUrl || product.image,
          brand: product.brand,
          quantity,
        },
      ];
      updateCartSnapshot(newCart);
      toast.success(`${product.title || product.name} added to cart`);
    }
  }, [cart]);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    const item = cart.find((i) => i._id === productId);
    if (item) {
      toast.success(`${item.title} removed from cart`);
    }
    const newCart = cart.filter((item) => item._id !== productId);
    updateCartSnapshot(newCart);
  }, [cart]);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    updateCartSnapshot(newCart);
  }, [cart, removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    updateCartSnapshot([]);
    toast.success("Cart cleared");
  }, []);

  // Calculate totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    return cart.some((item) => item._id === productId);
  }, [cart]);

  // Get item quantity in cart
  const getItemQuantity = useCallback((productId) => {
    const item = cart.find((i) => i._id === productId);
    return item ? item.quantity : 0;
  }, [cart]);

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
