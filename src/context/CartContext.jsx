"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY =
  "computerhub_cart";

export function CartProvider({
  children,
}) {
  const [cartItems, setCartItems] =
    useState([]);

  const [isLoaded, setIsLoaded] =
    useState(false);

  /*
   * Load the existing cart once when
   * the browser is ready.
   */
  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(
          CART_STORAGE_KEY
        );

      if (savedCart) {
        const parsedCart =
          JSON.parse(savedCart);

        if (
          Array.isArray(parsedCart)
        ) {
          setCartItems(
            parsedCart
          );
        }
      }
    } catch (error) {
      console.error(
        "Unable to load cart:",
        error
      );

      setCartItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /*
   * Save the cart whenever it changes.
   */
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(
          cartItems
        )
      );
    } catch (error) {
      console.error(
        "Unable to save cart:",
        error
      );
    }
  }, [
    cartItems,
    isLoaded,
  ]);

  /*
   * Add product to cart.
   */
  const addToCart = (
    product,
    quantity = 1
  ) => {
    if (!isLoaded) {
      return false;
    }

    if (!product) {
      return false;
    }

    const productId =
      product.id?.toString() ||
      product._id?.toString();

    if (!productId) {
      console.error(
        "Cannot add product without an ID."
      );

      return false;
    }

    /*
     * Keep the real stock value from
     * the product.
     */
    const stock = Number(
      product.stock
    );

    if (
      !Number.isFinite(stock) ||
      stock <= 0
    ) {
      return false;
    }

    const requestedQuantity =
      Math.max(
        1,
        Math.min(
          Number(quantity) || 1,
          stock
        )
      );

    setCartItems(
      (currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              String(
                item.id
              ) ===
              String(productId)
          );

        /*
         * Product already exists.
         * Increase quantity.
         */
        if (existingItem) {
          const existingQuantity =
            Number(
              existingItem.quantity
            ) || 0;

          const newQuantity =
            Math.min(
              existingQuantity +
                requestedQuantity,
              stock
            );

          return currentItems.map(
            (item) =>
              String(
                item.id
              ) ===
              String(productId)
                ? {
                    ...item,

                    id: productId,

                    _id: productId,

                    quantity:
                      newQuantity,

                    stock,
                  }
                : item
          );
        }

        /*
         * New product.
         *
         * Keep all useful product
         * information so the cart page
         * can display it correctly.
         */
        const cartItem = {
          ...product,

          id: productId,

          _id: productId,

          quantity:
            requestedQuantity,

          stock,
        };

        return [
          ...currentItems,
          cartItem,
        ];
      }
    );

    return true;
  };

  /*
   * Remove product.
   */
  const removeFromCart = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            String(item.id) !==
            String(productId)
        )
    );
  };

  /*
   * Update product quantity.
   */
  const updateQuantity = (
    productId,
    quantity
  ) => {
    const newQuantity =
      Number(quantity);

    if (
      !Number.isFinite(
        newQuantity
      ) ||
      newQuantity <= 0
    ) {
      removeFromCart(
        productId
      );

      return;
    }

    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) => {
            if (
              String(
                item.id
              ) !==
              String(productId)
            ) {
              return item;
            }

            const stock =
              Number(
                item.stock
              );

            /*
             * If stock is valid,
             * never allow quantity
             * above available stock.
             */
            if (
              Number.isFinite(
                stock
              ) &&
              stock > 0
            ) {
              return {
                ...item,

                quantity:
                  Math.min(
                    Math.max(
                      1,
                      newQuantity
                    ),
                    stock
                  ),
              };
            }

            return {
              ...item,

              quantity:
                Math.max(
                  1,
                  newQuantity
                ),
            };
          }
        )
    );
  };

  /*
   * Remove everything.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /*
   * Total quantity of all products.
   */
  const itemCount =
    useMemo(() => {
      return cartItems.reduce(
        (
          total,
          item
        ) =>
          total +
          (Number(
            item.quantity
          ) || 0),
        0
      );
    }, [cartItems]);

  /*
   * Cart subtotal.
   */
  const subtotal =
    useMemo(() => {
      return cartItems.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.price || 0
          ) *
            (Number(
              item.quantity
            ) || 0),
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
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}