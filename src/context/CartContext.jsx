"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const CartContext = createContext(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevEmailRef = useRef(null);

  // Fetch cart from server when user logs in
  useEffect(() => {
    async function fetchCart() {
      if (status === "loading") return;
      
      if (session?.user?.email) {
        // User logged in - fetch their cart from database
        if (prevEmailRef.current !== session.user.email) {
          setIsLoading(true);
          try {
            const response = await fetch(
              `${API_URL}/api/cart/${encodeURIComponent(session.user.email)}`
            );
            if (response.ok) {
              const data = await response.json();
              setCart(data.items || []);
            }
          } catch (error) {
            console.error("Error fetching cart:", error);
          } finally {
            setIsLoading(false);
          }
          prevEmailRef.current = session.user.email;
        }
      } else {
        // User logged out - clear cart
        if (prevEmailRef.current !== null) {
          setCart([]);
          prevEmailRef.current = null;
        }
        setIsLoading(false);
      }
    }

    fetchCart();
  }, [session?.user?.email, status]);

  // Sync cart to server whenever it changes (debounced)
  const syncCartToServer = useCallback(async (newCart) => {
    if (!session?.user?.email) return;
    
    try {
      await fetch(`${API_URL}/api/cart/${encodeURIComponent(session.user.email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newCart }),
      });
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  }, [session?.user?.email]);

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!session?.user?.email) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item._id === product._id);
      let newCart;

      if (existingItem) {
        newCart = currentCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated quantity in cart`);
      } else {
        newCart = [
          ...currentCart,
          {
            _id: product._id,
            title: product.title || product.name,
            price: product.price,
            imageUrl: product.imageUrl || product.image,
            brand: product.brand,
            quantity,
          },
        ];
        toast.success(`${product.title || product.name} added to cart`);
      }

      // Sync to server
      syncCartToServer(newCart);
      return newCart;
    });
  }, [session?.user?.email, syncCartToServer]);

  // Remove item from cart
  const removeFromCart = useCallback(async (productId) => {
    setCart((currentCart) => {
      const item = currentCart.find((i) => i._id === productId);
      if (item) {
        toast.success(`${item.title} removed from cart`);
      }
      const newCart = currentCart.filter((item) => item._id !== productId);
      
      // Sync to server
      if (session?.user?.email) {
        syncCartToServer(newCart);
      }
      return newCart;
    });
  }, [session?.user?.email, syncCartToServer]);

  // Update item quantity
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) => {
      const newCart = currentCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      
      // Sync to server
      if (session?.user?.email) {
        syncCartToServer(newCart);
      }
      return newCart;
    });
  }, [session?.user?.email, removeFromCart, syncCartToServer]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setCart([]);
    
    if (session?.user?.email) {
      try {
        await fetch(`${API_URL}/api/cart/${encodeURIComponent(session.user.email)}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  }, [session?.user?.email]);

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
        isLoading,
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
