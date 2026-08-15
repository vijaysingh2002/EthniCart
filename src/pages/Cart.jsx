/*
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id}>
              <h2>{item.name}</h2>

              <p>Price: ₹{item.price}</p>

              <p>Quantity: {item.quantity}</p>

              <button onClick={() => decreaseQuantity(item.id)}>
                -
              </button>

              <button onClick={() => addToCart(item)}>
                +
              </button>

              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>

              <hr />
            </div>
          ))}

          <h2>Total Price: ₹{totalPrice}</h2>
        </>
      )}
    </div>
  );
};

export default Cart;
*/
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
  FiShield,
  FiTruck,
} from "react-icons/fi";

import { CartContext } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    cartLoading,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  // =========================
  // PRICE CALCULATIONS
  // =========================
  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  const deliveryCharge = subtotal > 0 ? 0 : 0;
  const totalPrice = subtotal + deliveryCharge;

  return (
    <main className="min-h-screen bg-[#faf9f7] text-gray-900">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-[#C49A6C] text-xs sm:text-sm font-semibold uppercase tracking-[3px]">
                EthniCart
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                Shopping Cart
              </h1>

              {cart.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              )}
            </div>

            {cart.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <FiShoppingBag size={17} />
                <span>Ready for checkout</span>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">

        {/* ===================================================
            EMPTY CART
        =================================================== */}
        {cartLoading ? (
          <div className="min-h-[50vh] flex items-center justify-center px-4">
            <div className="text-center">

              <div
                className="
                  w-10 h-10
                  sm:w-12 sm:h-12
                  mx-auto
                  border-4
                  border-gray-200
                  border-t-[#C49A6C]
                  rounded-full
                  animate-spin
                "
              />

              <h2 className="mt-5 text-base sm:text-lg font-semibold text-gray-800">
                Loading cart...
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-gray-400">
                Please wait while we load your cart.
              </p>

            </div>
          </div>
        ) : cart.length === 0 ? (

          <div className="max-w-lg mx-auto">

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-14 sm:py-16 text-center">

              <div className="w-20 h-20 mx-auto rounded-full bg-[#C49A6C]/10 flex items-center justify-center">
                <FiShoppingBag
                  size={34}
                  className="text-[#C49A6C]"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-6">
                Your cart is empty
              </h2>

              <p className="text-gray-500 text-sm sm:text-base leading-6 mt-3 max-w-sm mx-auto">
                Looks like you haven't added anything to your cart yet.
                Explore our collection and find something you love.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 mt-7 bg-gray-900 hover:bg-[#C49A6C] text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-300"
              >
                <FiShoppingBag size={18} />
                Continue Shopping
              </Link>

            </div>

          </div>

        ) : (

          <div className="grid lg:grid-cols-[1fr_380px] gap-7 lg:gap-10">

            {/* =================================================
                LEFT — CART ITEMS
            ================================================= */}
            <div className="min-w-0">

              {/* Section heading */}
              <div className="flex items-center justify-between mb-4">

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Your Items
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Review your selected products
                  </p>
                </div>

                <span className="text-sm font-medium text-gray-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>

              </div>

              {/* Items */}
              <div className="space-y-3">

                {cart.map((item) => (

                  <article
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4"
                  >

                    <div className="flex gap-3 sm:gap-5">

                      {/* IMAGE */}
                      <Link
                        to={`/product/${item.id}`}
                        className="shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-28 sm:w-32 sm:h-36 object-cover rounded-xl bg-gray-100"
                        />
                      </Link>

                      {/* DETAILS */}
                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-3">

                          <div className="min-w-0">

                            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-medium">
                              {item.category}
                            </p>

                            <Link to={`/product/${item.id}`}>
                              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mt-1 line-clamp-2 hover:text-[#C49A6C] transition">
                                {item.name}
                              </h3>
                            </Link>

                          </div>

                          {/* REMOVE */}
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            aria-label={`Remove ${item.name}`}
                            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          >
                            <FiTrash2 size={17} />
                          </button>

                        </div>

                        {/* PRICE */}
                        <div className="flex items-center gap-2 mt-2 sm:mt-3">

                          <span className="text-base sm:text-xl font-bold text-gray-900">
                            ₹
                            {Number(item.price).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          {item.oldPrice && (
                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                              ₹
                              {Number(
                                item.oldPrice
                              ).toLocaleString("en-IN")}
                            </span>
                          )}

                        </div>

                        {/* BOTTOM ROW */}
                        <div className="flex items-end justify-between gap-3 mt-3 sm:mt-5">

                          {/* QUANTITY */}
                          <div>

                            <p className="hidden sm:block text-xs text-gray-400 mb-1.5">
                              Quantity
                            </p>

                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">

                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(item.id)
                                }
                                aria-label="Decrease quantity"
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#C49A6C] transition"
                              >
                                <FiMinus size={14} />
                              </button>

                              <span className="w-8 sm:w-9 text-center text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  addToCart(item)
                                }
                                aria-label="Increase quantity"
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#C49A6C] transition"
                              >
                                <FiPlus size={14} />
                              </button>

                            </div>

                          </div>

                          {/* ITEM TOTAL */}
                          <div className="text-right">

                            <p className="text-[10px] sm:text-xs text-gray-400">
                              Item Total
                            </p>

                            <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5">
                              ₹
                              {(
                                Number(item.price) *
                                Number(item.quantity)
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

              {/* CONTINUE SHOPPING */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-gray-600 hover:text-[#C49A6C] transition"
              >
                <FiArrowLeft size={16} />
                Continue Shopping
              </Link>

            </div>

            {/* =================================================
                RIGHT — ORDER SUMMARY
            ================================================= */}
            <aside>

              <div className="lg:sticky lg:top-6">

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

                  <h2 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>

                  {/* SUMMARY */}
                  <div className="space-y-4 mt-6">

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Items
                      </span>

                      <span className="font-medium text-gray-900">
                        {totalItems}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-medium text-gray-900">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Delivery
                      </span>

                      <span className="font-semibold text-green-600">
                        Free
                      </span>
                    </div>

                  </div>

                  {/* TOTAL */}
                  <div className="border-t border-gray-100 mt-6 pt-5">

                    <div className="flex items-center justify-between">

                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>

                      <span className="text-xl sm:text-2xl font-bold text-[#C49A6C]">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>

                    </div>

                  </div>

                  {/* CHECKOUT */}
                  <Link
                    to="/checkout"
                    className="mt-6 w-full bg-gray-900 hover:bg-[#C49A6C] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <FiShoppingBag size={18} />
                    Proceed to Checkout
                  </Link>

                  {/* TRUST */}
                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <div className="bg-[#faf9f7] rounded-xl p-3">

                      <FiTruck
                        size={18}
                        className="text-[#C49A6C]"
                      />

                      <p className="text-xs font-semibold text-gray-700 mt-2">
                        Free Delivery
                      </p>

                    </div>

                    <div className="bg-[#faf9f7] rounded-xl p-3">

                      <FiShield
                        size={18}
                        className="text-[#C49A6C]"
                      />

                      <p className="text-xs font-semibold text-gray-700 mt-2">
                        Secure Checkout
                      </p>

                    </div>

                  </div>

                  <p className="text-center text-[11px] text-gray-400 mt-5">
                    Easy returns · Secure payment · Trusted shopping
                  </p>

                </div>

              </div>

            </aside>

          </div>

        )}

      </section>

    </main>
  );
};

export default Cart;