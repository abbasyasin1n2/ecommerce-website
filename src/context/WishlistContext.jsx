'use client';

import { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const WishlistContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function WishlistProvider({ children }) {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevEmailRef = useRef(null);

  // Fetch wishlist from server when user logs in
  useEffect(() => {
    async function fetchWishlist() {
      if (status === "loading") return;
      
      if (session?.user?.email) {
        // User logged in - fetch their wishlist from database
        if (prevEmailRef.current !== session.user.email) {
          setIsLoading(true);
          try {
            const response = await fetch(
              `${API_URL}/api/wishlist/${encodeURIComponent(session.user.email)}`
            );
            if (response.ok) {
              const data = await response.json();
              setWishlist(data.items || []);
            }
          } catch (error) {
            console.error("Error fetching wishlist:", error);
          } finally {
            setIsLoading(false);
          }
          prevEmailRef.current = session.user.email;
        }
      } else {
        // User logged out - clear wishlist
        if (prevEmailRef.current !== null) {
          setWishlist([]);
          prevEmailRef.current = null;
        }
        setIsLoading(false);
      }
    }

    fetchWishlist();
  }, [session?.user?.email, status]);

  // Sync wishlist to server
  const syncWishlistToServer = useCallback(async (newWishlist) => {
    if (!session?.user?.email) return;
    
    try {
      await fetch(`${API_URL}/api/wishlist/${encodeURIComponent(session.user.email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newWishlist }),
      });
    } catch (error) {
      console.error("Error syncing wishlist:", error);
    }
  }, [session?.user?.email]);

  const addToWishlist = useCallback((product) => {
    if (!session?.user?.email) return false;
    
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(item => item._id === product._id);
      
      if (!exists) {
        const newWishlist = [...currentWishlist, {
          _id: product._id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          brand: product.brand,
          category: product.category,
          rating: product.rating
        }];
        syncWishlistToServer(newWishlist);
        return newWishlist;
      }
      return currentWishlist;
    });
    return true;
  }, [session?.user?.email, syncWishlistToServer]);

  const removeFromWishlist = useCallback((productId) => {
    if (!session?.user?.email) return;
    
    setWishlist((currentWishlist) => {
      const newWishlist = currentWishlist.filter(item => item._id !== productId);
      syncWishlistToServer(newWishlist);
      return newWishlist;
    });
  }, [session?.user?.email, syncWishlistToServer]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item._id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    if (!session?.user?.email) return false;
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  }, [session?.user?.email, addToWishlist, removeFromWishlist, isInWishlist]);

  const clearWishlist = useCallback(async () => {
    setWishlist([]);
    
    if (session?.user?.email) {
      try {
        await fetch(`${API_URL}/api/wishlist/${encodeURIComponent(session.user.email)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [] }),
        });
      } catch (error) {
        console.error("Error clearing wishlist:", error);
      }
    }
  }, [session?.user?.email]);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
