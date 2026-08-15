import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FiCheckCircle,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiShield,
} from "react-icons/fi";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const {
    cart,
    clearCart,
  } = useContext(CartContext);

  const {
    user,
    updateUser,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  // =========================
  // DELIVERY FORM
  // =========================

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =========================
  // PAYMENT
  // =========================

  const [payment, setPayment] = useState("cod");

  // =========================
  // SUBMITTING
  // =========================

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // LOAD USER DATA
  // =========================

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.location || "",
    }));
  }, [user]);

  // =========================
  // TOTAL
  // =========================

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (!cart.length) {
      navigate("/shop");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        userId: user.id,

        customer: {
          id: user.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },

        total: Number(totalPrice),

        payment,

        items: cart.map((item) => ({
          id: String(item.id),
          name: item.name,
          image: item.image,
          category: item.category,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      };

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      updateUser({
        phone: form.phone,
        location: form.city,
        orders: Number(user.orders || 0) + 1,
        spent:
          Number(user.spent || 0) + Number(totalPrice),
      });

      clearCart();

      navigate("/order-success", {
        state: {
          order: data.order,
        },
      });
    } catch (error) {
      console.error("Place order error:", error);

      alert(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-4 sm:px-6">

        <div className="bg-white rounded-3xl p-8 sm:p-10 text-center shadow-sm max-w-md w-full">

          <div className="w-20 h-20 mx-auto rounded-full bg-[#C49A6C]/10 flex items-center justify-center">
            <FiCheckCircle
              size={48}
              className="text-[#C49A6C]"
            />
          </div>

          <h1 className="text-2xl font-bold mt-5 text-gray-900">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mt-2">
            Add some products before checkout.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-6 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
          >
            <FiShoppingBag size={18} />
            Continue Shopping
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] pb-24 lg:pb-0">

      {/* =========================
          HEADER
      ========================= */}

      <section className="bg-white py-10 sm:py-14">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <p className="text-[#C49A6C] uppercase tracking-[4px] text-xs sm:text-sm font-semibold">
            EthniCart
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 text-gray-900">
            Checkout
          </h1>

          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            Complete your details and place your order.
          </p>

        </div>

      </section>

      {/* =========================
          CHECKOUT CONTENT
      ========================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">

          {/* =========================
              CUSTOMER FORM
          ========================= */}

          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-7 shadow-sm space-y-6"
          >

            {/* DELIVERY INFORMATION */}

            <div>

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                  <FiMapPin
                    className="text-[#C49A6C]"
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Delivery Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Where should we deliver your order?
                  </p>
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-5">

                {/* NAME */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10 transition"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10 transition"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10 transition"
                  />
                </div>

                {/* PINCODE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="Enter PIN code"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10 transition"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10 transition"
                  />
                </div>

                {/* STATE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10 transition"
                  />
                </div>

              </div>

              {/* ADDRESS */}

              <div className="mt-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Delivery Address
                </label>

                <textarea
                  name="address"
                  placeholder="House / Flat No., Street, Area..."
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10 transition resize-none"
                />

              </div>

            </div>

            {/* PAYMENT */}

            <div className="border-t border-gray-100 pt-7">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                  <FiCreditCard
                    className="text-[#C49A6C]"
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Select your preferred payment option.
                  </p>
                </div>

              </div>

              <div className="space-y-3">

                {/* COD */}

                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                    payment === "cod"
                      ? "border-[#C49A6C] bg-[#C49A6C]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === "cod"}
                    onChange={(e) =>
                      setPayment(e.target.value)
                    }
                    className="accent-[#C49A6C]"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Pay when your order arrives.
                    </p>
                  </div>

                </label>

                {/* ONLINE */}

                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                    payment === "online"
                      ? "border-[#C49A6C] bg-[#C49A6C]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={payment === "online"}
                    onChange={(e) =>
                      setPayment(e.target.value)
                    }
                    className="accent-[#C49A6C]"
                    disabled
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Online Payment
                    </p>
                    <span
                      className="
                        text-[10px] sm:text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        px-2 py-1
                        rounded-full
                        bg-[#C49A6C]/10
                        text-[#A98259]
                        whitespace-nowrap
                      "
                    >
                      Coming Soon
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay securely online.
                    </p>
                  </div>

                </label>

              </div>

            </div>

            {/* DESKTOP PLACE ORDER */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="hidden lg:flex w-full bg-[#C49A6C] text-white py-4 rounded-xl font-semibold items-center justify-center gap-2 hover:bg-[#a98259] disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              <FiShoppingBag size={19} />

              {isSubmitting
                ? "Placing Order..."
                : "Place Order"}
            </button>

            {/* SECURITY */}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
              <FiShield size={14} />
              Secure checkout · Your information is protected
            </div>

          </form>

          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <aside className="lg:col-span-1">

            <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm lg:sticky lg:top-6">

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your Order
              </h2>

              <div className="mt-6 space-y-5">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg shrink-0"
                    />

                    <div className="flex-1 min-w-0">

                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>

                      <p className="font-semibold text-gray-900 mt-1">
                        ₹
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              {/* TOTAL */}

              <div className="border-t border-gray-200 mt-7 pt-6">

                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>

                  <span>
                    ₹
                    {totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500 mt-3">
                  <span>Delivery</span>

                  <span className="text-green-600 font-medium">
                    Free
                  </span>
                </div>

                <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between items-center">

                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl sm:text-2xl font-bold text-[#C49A6C]">
                    ₹
                    {totalPrice.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

              {/* MOBILE PLACE ORDER */}

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="lg:hidden mt-6 w-full bg-[#C49A6C] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#a98259] disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                <FiShoppingBag size={19} />

                {isSubmitting
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Secure checkout · Easy returns
              </p>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
};

export default Checkout;