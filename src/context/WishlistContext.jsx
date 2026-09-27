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

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(
        WISHLIST_STORAGE_KEY
      );

      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);

        if (Array.isArray(parsedWishlist)) {
          setWishlistItems(parsedWishlist);
        }
      }
    } catch {
      setWishlistItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistItems)
      );
    } catch {}
  }, [wishlistItems, isLoaded]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => String(item.id) === String(productId)
    );
  };

  const addToWishlist = (product) => {
    if (!product || !product.id) return;

    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) =>
          String(item.id) === String(product.id)
      );

      if (alreadyExists) return currentItems;

      return [
        ...currentItems,
        {
          ...product,
        },
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) =>
          String(item.id) !== String(productId)
      )
    );
  };

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;

    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (item) =>
          String(item.id) === String(product.id)
      );

      if (exists) {
        return currentItems.filter(
          (item) =>
            String(item.id) !== String(product.id)
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

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const wishlistCount = useMemo(
    () => wishlistItems.length,
    [wishlistItems]
  );

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