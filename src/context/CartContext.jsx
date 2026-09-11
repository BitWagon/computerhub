"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "computerhub_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cartItems, isLoaded]);

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      return;
    }

    const safeQuantity = Math.max(
      1,
      Number(quantity) || 1
    );

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          String(item.id) === String(product.id)
      );

      if (existingItem) {
        return currentItems.map((item) => {
          if (
            String(item.id) !==
            String(product.id)
          ) {
            return item;
          }

          const maxStock =
            Number(item.stock) || 999;

          return {
            ...item,
            quantity: Math.min(
              item.quantity + safeQuantity,
              maxStock
            ),
          };
        });
      }

      const maxStock =
        Number(product.stock) || 999;

      return [
        ...currentItems,
        {
          ...product,
          quantity: Math.min(
            safeQuantity,
            maxStock
          ),
        },
      ];
    });
  };

  // Remove product
  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          String(item.id) !==
          String(productId)
      )
    );
  };

  // Update quantity
  const updateQuantity = (
    productId,
    quantity
  ) => {
    const newQuantity = Number(quantity);

    if (!Number.isFinite(newQuantity)) {
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (
          String(item.id) !==
          String(productId)
        ) {
          return item;
        }

        const maxStock =
          Number(item.stock) || 999;

        return {
          ...item,
          quantity: Math.min(
            Math.max(1, newQuantity),
            maxStock
          ),
        };
      })
    );
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (
          String(item.id) !==
          String(productId)
        ) {
          return item;
        }

        const maxStock =
          Number(item.stock) || 999;

        return {
          ...item,
          quantity: Math.min(
            item.quantity + 1,
            maxStock
          ),
        };
      })
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (
            String(item.id) !==
            String(productId)
          ) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total number of products
  const itemCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  // Total price
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const value = {
    cartItems,
    itemCount,
    subtotal,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}