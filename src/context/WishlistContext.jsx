"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext(null);

const WISHLIST_STORAGE_KEY = "computerhub_wishlist";

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(
        WISHLIST_STORAGE_KEY
      );

      if (savedWishlist) {
        const parsedWishlist =
          JSON.parse(savedWishlist);

        if (Array.isArray(parsedWishlist)) {
          setWishlistItems(parsedWishlist);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistItems)
      );
    } catch (error) {
      console.error(
        "Failed to save wishlist:",
        error
      );
    }
  }, [wishlistItems, isLoaded]);

  // Check if a product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) =>
        String(item.id) === String(productId)
    );
  };

  // Add product
  const addToWishlist = (product) => {
    if (!product || !product.id) {
      return;
    }

    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

      if (alreadyExists) {
        return currentItems;
      }

      return [
        ...currentItems,
        {
          ...product,
        },
      ];
    });
  };

  // Remove product
  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) =>
          String(item.id) !==
          String(productId)
      )
    );
  };

  // Add/remove product
  const toggleWishlist = (product) => {
    if (!product || !product.id) {
      return;
    }

    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

      if (exists) {
        return currentItems.filter(
          (item) =>
            String(item.id) !==
            String(product.id)
        );
      }

      return [
        ...currentItems,
        {
          ...product,
        },
      ];
    });
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Number of wishlist products
  const wishlistCount = useMemo(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    wishlistCount,
    isLoaded,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}