import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    try {
      setCartLoading(true);

      const savedCart = JSON.parse(
        localStorage.getItem("ethnicartCart") || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cartLoading) {
      localStorage.setItem(
        "ethnicartCart",
        JSON.stringify(cart)
      );
    }
  }, [cart, cartLoading]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================
  // REMOVE PRODUCT
  // =========================
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // =========================
  // CLEAR CART
  // =========================
  const clearCart = () => {
    setCart([]);
  };

  // =========================
  // SAVE ORDER
  // =========================
  const saveOrder = (order) => {
    const existingOrders = JSON.parse(
      localStorage.getItem("ethnicartOrders") || "[]"
    );

    const updatedOrders = [
      ...existingOrders,
      order,
    ];

    localStorage.setItem(
      "ethnicartOrders",
      JSON.stringify(updatedOrders)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        addToCart,
        decreaseQuantity,
        increaseQuantity,
        removeFromCart,
        clearCart,
        saveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;