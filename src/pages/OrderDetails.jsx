import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const TRACKING_STEPS = [
  {
    status: "Confirmed",
    title: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: FiCheckCircle,
  },
  {
    status: "Processing",
    title: "Processing",
    description: "Your order is being prepared.",
    icon: FiPackage,
  },
  {
    status: "Shipped",
    title: "Shipped",
    description: "Your order is on the way.",
    icon: FiTruck,
  },
  {
    status: "Delivered",
    title: "Delivered",
    description: "Your order has been delivered.",
    icon: FiCheckCircle,
  },
];

const STATUS_ORDER = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

const API_URL = import.meta.env.VITE_API_URL;

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {
    loadOrder();
  }, [id]);

  const token = localStorage.getItem("token");

  const loadOrder = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/orders/${id}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch order"
        );
      }

      setOrder(data.order);
      setCancelled(data.order.status === "Cancelled");
    } catch (error) {
      console.error("Failed to load order:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async () => {
    try {
      setCancelLoading(true);

      const response = await fetch(
        `${API_URL}/orders/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel order"
        );
      }

      setOrder(data.order);
      setCancelled(true);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Cancel order error:", error);
      alert(error.message);
    } finally {
      setCancelLoading(false);
    }
  };

  // =====================================================
  // GET CURRENT STATUS INDEX
  // =====================================================

  const getStatusIndex = () => {
    if (!order?.status) return 1;

    return STATUS_ORDER.indexOf(order.status);
  };

  const currentStatusIndex = getStatusIndex();

  // =====================================================
  // CAN CANCEL?
  // =====================================================

  const canCancel =
    order &&
    !["Shipped", "Delivered", "Cancelled"].includes(
      order.status
    );

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="animate-pulse">

            {/* Header */}
            <div className="bg-white border-b rounded-2xl p-6 md:p-10 mb-6">
              <div className="h-4 w-28 bg-gray-200 rounded mb-6" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
              <div className="h-10 w-52 bg-gray-200 rounded mb-4" />
              <div className="h-4 w-80 bg-gray-200 rounded" />
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl border p-6 mb-6">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />

                  <div className="space-y-3">
                    <div className="h-5 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-72 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="h-9 w-24 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Main content */}
            <div className="grid lg:grid-cols-3 gap-6">

              {/* Products */}
              <div className="lg:col-span-2 bg-white rounded-2xl border p-6">
                <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex gap-4 p-3 border rounded-xl"
                    >
                      <div className="w-24 h-28 bg-gray-200 rounded-xl" />

                      <div className="flex-1 space-y-3 pt-2">
                        <div className="h-5 w-3/4 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                        <div className="h-5 w-24 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-5 flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-7 w-28 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Right side */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border p-6">
                  <div className="h-6 w-24 bg-gray-200 rounded mb-6" />
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border p-6">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
                  <div className="space-y-3">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl border shadow-sm p-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
              <FiPackage size={30} className="text-gray-400" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mt-5">
              Order Not Found
            </h1>

            <p className="text-gray-500 mt-2">
              We couldn't find this order.
            </p>

            <Link
              to="/orders"
              className="inline-flex items-center gap-2 mt-6 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              <FiArrowLeft />
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C49A6C] transition font-medium"
          >
            <FiArrowLeft />
            Back to Orders
          </Link>

          <div className="mt-6">
            <p className="text-[#C49A6C] uppercase tracking-[3px] font-semibold text-sm">
              EthniCart
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Order Details
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <p className="text-gray-500">
                Order ID:
              </p>

              <span className="font-bold text-gray-900">
                {order.orderId}
              </span>

              <span className="text-gray-300">
                •
              </span>

              <span className="text-sm text-gray-500">
                {order.createdAt
                ? new Date(order.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        {/* =====================================================
            STATUS SUMMARY
        ===================================================== */}

        <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-4">

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  cancelled
                    ? "bg-red-50"
                    : "bg-green-50"
                }`}
              >
                {cancelled ? (
                  <FiXCircle
                    size={25}
                    className="text-red-500"
                  />
                ) : (
                  <FiPackage
                    size={25}
                    className="text-green-500"
                  />
                )}
              </div>

              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {cancelled
                    ? "Order Cancelled"
                    : order.status === "Delivered"
                    ? "Order Delivered"
                    : "Order in Progress"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {cancelled
                    ? "This order has been cancelled."
                    : order.status === "Delivered"
                    ? "Your order has been successfully delivered."
                    : "You can track your order status below."}
                </p>
              </div>

            </div>

            <span
              className={`inline-flex w-fit px-4 py-2 rounded-full text-sm font-semibold ${
                cancelled
                  ? "bg-red-50 text-red-600"
                  : order.status === "Delivered"
                  ? "bg-green-50 text-green-600"
                  : order.status === "Shipped"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {order.status || "Confirmed"}
            </span>

          </div>

        </div>

        {/* =====================================================
            TRACKING
        ===================================================== */}

        <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-7 mb-6">

          <div className="flex items-center justify-between gap-3 mb-7">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Order Tracking
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Track your order from confirmation to delivery.
              </p>
            </div>

            <FiTruck
              size={24}
              className="text-[#C49A6C]"
            />

          </div>

          {cancelled ? (
            <div className="rounded-xl bg-red-50 border border-red-100 p-5 flex gap-4">

              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <FiXCircle
                  className="text-red-500"
                  size={20}
                />
              </div>

              <div>
                <h3 className="font-bold text-red-700">
                  Order Cancelled
                </h3>

                <p className="text-sm text-red-600 mt-1">
                  This order will no longer be processed.
                </p>

                {order.cancelledAt && (
                  <p className="text-xs text-red-500 mt-2">
                    Cancelled on{" "}
                    {new Date(
                      order.cancelledAt
                    ).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="relative">

              <div className="absolute left-[19px] top-5 bottom-5 w-[2px] bg-gray-200" />

              <div className="space-y-7">

                {TRACKING_STEPS.map(
                  (step, index) => {
                    const StepIcon = step.icon;

                    const stepIndex =
                      STATUS_ORDER.indexOf(
                        step.status
                      );

                    const isCompleted =
                      currentStatusIndex >=
                      stepIndex;

                    const isCurrent =
                      order.status ===
                      step.status;

                    return (
                      <div
                        key={step.status}
                        className="relative flex gap-4"
                      >

                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shrink-0 ${
                            isCompleted
                              ? "bg-[#C49A6C] text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <StepIcon size={17} />
                        </div>

                        <div className="pt-1 flex-1">

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

                            <h3
                              className={`font-semibold ${
                                isCompleted
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.title}
                            </h3>

                            {isCurrent && (
                              <span className="w-fit text-xs font-semibold bg-[#C49A6C]/10 text-[#A98259] px-3 py-1 rounded-full">
                                Current Status
                              </span>
                            )}

                          </div>

                          <p
                            className={`text-sm mt-1 ${
                              isCompleted
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            {step.description}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

        </div>

        {/* =====================================================
            CONTENT GRID
        ===================================================== */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ===================================================
              PRODUCTS
          =================================================== */}

          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-5 md:p-7">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Ordered Products
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {order.items?.length || 0} product
                  {order.items?.length === 1
                    ? ""
                    : "s"}
                </p>
              </div>

              <FiPackage
                size={23}
                className="text-[#C49A6C]"
              />

            </div>

            <div className="space-y-4">

              {order.items?.map((item, index) => (

                <div
                  key={`${item.id}-${index}`}
                  className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">

                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>

                    {item.category && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.category}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-gray-500">
                      <span>
                        Qty: {item.quantity}
                      </span>

                      <span>
                        ₹
                        {Number(
                          item.price || 0
                        ).toLocaleString("en-IN")}{" "}
                        each
                      </span>
                    </div>

                    <p className="font-bold text-gray-900 mt-3">
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}

            <div className="border-t border-gray-200 mt-6 pt-5">

              <div className="flex justify-between items-center">

                <span className="text-gray-500">
                  Order Total
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  ₹
                  {Number(
                    order.total || 0
                  ).toLocaleString("en-IN")}
                </span>

              </div>

            </div>

          </div>

          {/* ===================================================
              RIGHT SIDE
          =================================================== */}

          <div className="space-y-6">

            {/* PAYMENT */}

            <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                  <FiCreditCard
                    size={21}
                    className="text-[#C49A6C]"
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Payment
                </h2>

              </div>

              <div className="mt-5 space-y-4">

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-gray-500">
                    Method
                  </span>

                  <span className="font-semibold text-gray-900 text-right">
                    {order.payment === "online"
                      ? "Online Payment"
                      : "Cash on Delivery"}
                  </span>

                </div>

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={`font-semibold ${
                      cancelled
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {cancelled
                      ? "Cancelled"
                      : order.payment === "online"
                      ? "Paid"
                      : "Pending"}
                  </span>

                </div>

              </div>

            </div>

            {/* DELIVERY */}

            <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                  <FiMapPin
                    size={21}
                    className="text-[#C49A6C]"
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Delivery Address
                </h2>

              </div>

              {order.customer ? (
                <div className="mt-5 text-sm text-gray-600 leading-6">

                  <p className="font-semibold text-gray-900">
                    {order.customer.name}
                  </p>

                  {order.customer.address && (
                    <p>
                      {order.customer.address}
                    </p>
                  )}

                  {(order.customer.city ||
                    order.customer.state) && (
                    <p>
                      {order.customer.city}
                      {order.customer.city &&
                      order.customer.state
                        ? ", "
                        : ""}
                      {order.customer.state}
                    </p>
                  )}

                  {order.customer.pincode && (
                    <p>
                      PIN Code:{" "}
                      {order.customer.pincode}
                    </p>
                  )}

                  {order.customer.phone && (
                    <p className="mt-2">
                      Phone:{" "}
                      {order.customer.phone}
                    </p>
                  )}

                  {order.customer.email && (
                    <p className="break-all">
                      Email:{" "}
                      {order.customer.email}
                    </p>
                  )}

                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-5">
                  Delivery information unavailable.
                </p>
              )}

            </div>

          </div>

        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">

          <Link
            to="/orders"
            className="flex-1 border border-gray-200 bg-white py-3.5 rounded-xl font-semibold text-center hover:bg-gray-50 transition"
          >
            View All Orders
          </Link>

          <Link
            to="/shop"
            className="flex-1 bg-[#C49A6C] text-white py-3.5 rounded-xl font-semibold text-center hover:bg-[#a98259] transition"
          >
            Continue Shopping
          </Link>

          {canCancel && (
            <button
              onClick={() =>
                setShowCancelConfirm(true)
              }
              className="sm:w-44 border border-red-200 bg-red-50 text-red-600 py-3.5 rounded-xl font-semibold hover:bg-red-100 transition"
            >
              Cancel Order
            </button>
          )}

        </div>

      </section>

      {/* =====================================================
          CANCEL CONFIRMATION MODAL
      ===================================================== */}

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <FiXCircle
                size={24}
                className="text-red-500"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Cancel this order?
            </h2>

            <p className="text-gray-500 text-sm mt-2 leading-6">
              Are you sure you want to cancel order{" "}
              <span className="font-semibold text-gray-800">
                {order.orderId}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  setShowCancelConfirm(false)
                }
                className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Keep Order
              </button>

              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="
                  flex-1
                  bg-red-600
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                  flex
                  items-center
                  justify-center
                  gap-2
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                "
              >
                {cancelLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>

            </div>

          </div>

        </div>
      )}
    </main>
  );
};

export default OrderDetails;