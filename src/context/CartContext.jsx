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

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch {
      setCartItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch {}
  }, [cartItems, isLoaded]);

 const addToCart = (product, quantity = 1) => {
  if (!product || !product.id) return;

  const stock = Number(product.stock || 0);

  if (stock <= 0) return;

  const requestedQuantity = Math.max(
    1,
    Math.min(Number(quantity) || 1, stock)
  );

  setCartItems((currentItems) => {
    const existingItem = currentItems.find(
      (item) =>
        String(item.id) === String(product.id)
    );

    if (existingItem) {
      const newQuantity = Math.min(
        existingItem.quantity + requestedQuantity,
        stock
      );

      return currentItems.map((item) =>
        String(item.id) === String(product.id)
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      );
    }

    return [
      ...currentItems,
      {
        ...product,
        quantity: requestedQuantity,
      },
    ];
  });
};

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          String(item.id) !== String(productId)
      )
    );
  };

  const updateQuantity = (productId, quantity) => {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  setCartItems((currentItems) =>
    currentItems.map((item) => {
      if (String(item.id) !== String(productId)) {
        return item;
      }

      const stock = Number(item.stock || 0);

      if (stock <= 0) {
        return item;
      }

      return {
        ...item,
        quantity: Math.min(quantity, stock),
      };
    })
  );
};

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.price || 0) * item.quantity,
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