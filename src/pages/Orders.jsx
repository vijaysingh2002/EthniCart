import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const Orders = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER ORDERS
  // =====================================================

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const loadOrders = async () => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      if (!token) {
        console.error("Authentication token missing");
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}/cancel`,
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

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId
            ? data.order
            : order
        )
      );
    } catch (error) {
      console.error("Cancel order error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Confirmed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // =====================================================
  // STATUS DOT
  // =====================================================

  const getStatusDot = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500";

      case "Shipped":
        return "bg-blue-500";

      case "Processing":
        return "bg-amber-500";

      case "Confirmed":
        return "bg-indigo-500";

      case "Cancelled":
        return "bg-red-500";

      default:
        return "bg-gray-500";
    }
  };

  // =====================================================
  // CAN CANCEL
  // =====================================================

  const canCancelOrder = (status) => {
    return (
      status !== "Delivered" &&
      status !== "Shipped" &&
      status !== "Cancelled"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-3 sm:px-5 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">

          <div>
            <p className="text-[#C49A6C] text-xs sm:text-sm font-bold uppercase tracking-[2px]">
              EthniCart
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              My Orders
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Track and manage your recent purchases
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="self-start sm:self-auto flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition"
          >
            ↻ Refresh
          </button>
        </div>

        {/* =================================================
            USER INFO
        ================================================= */}

        {user && (
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                Account
              </p>

              <p className="text-sm font-semibold text-gray-900">
                {user.name}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 break-all">
              {user.email}
            </p>
          </div>
        )}

        {/* =================================================
            NO ORDERS
        ================================================= */}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
              >
                {/* Top bar */}
                <div className="flex justify-between mb-5">
                  <div className="space-y-2">
                    <div className="h-2.5 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>

                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>

                {/* Order body */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0" />

                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                  </div>

                  <div className="hidden sm:block">
                    <div className="h-9 w-24 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl mb-4">
              📦
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No Orders Yet
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Your placed orders will appear here.
            </p>

            <Link
              to="/shop"
              className="inline-flex mt-5 bg-[#C49A6C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#a98259] transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (

          /* =================================================
             ORDER LIST
          ================================================= */

          <div className="space-y-3">

            {orders.map((order) => {
              const status =
                order.status || "Confirmed";

              const firstItem =
                Array.isArray(order.items) &&
                order.items.length > 0
                  ? order.items[0]
                  : null;

              const totalItems = Array.isArray(
                order.items
              )
                ? order.items.reduce(
                    (sum, item) =>
                      sum +
                      Number(
                        item.quantity || 1
                      ),
                    0
                  )
                : Number(
                    order.itemsCount ||
                      order.items ||
                      0
                  );

              return (
                <div
                  key={order.orderId}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition"
                >

                  {/* =================================================
                      TOP BAR
                  ================================================= */}

                  <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">

                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">
                          Order ID
                        </span>

                        <span className="text-xs sm:text-sm font-bold text-gray-800">
                          {order.orderId}
                        </span>
                      </div>

                      <div className="hidden sm:block h-6 w-px bg-gray-200" />

                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">
                          Ordered on
                        </span>

                        <span className="text-xs sm:text-sm text-gray-600">
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

                      <div className="hidden sm:block h-6 w-px bg-gray-200" />

                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">
                          Total
                        </span>

                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* STATUS */}

                    <span
                      className={`inline-flex self-start sm:self-auto items-center gap-1.5 border px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${getStatusStyle(
                        status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                          status
                        )}`}
                      />

                      {status}
                    </span>
                  </div>

                  {/* =================================================
                      ORDER BODY
                  ================================================= */}

                  <div className="p-4 sm:p-5">

                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                      {/* PRODUCT */}

                      <div className="flex items-center gap-3 flex-1 min-w-0">

                        {firstItem?.image ? (
                          <img
                            src={firstItem.image}
                            alt={
                              firstItem.name ||
                              "Product"
                            }
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-100 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                            📦
                          </div>
                        )}

                        <div className="min-w-0">

                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {firstItem?.name ||
                              "Order Items"}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            {totalItems}{" "}
                            {totalItems === 1
                              ? "item"
                              : "items"}
                          </p>

                          {firstItem && (
                            <p className="text-xs text-gray-500 mt-1">
                              Qty:{" "}
                              {firstItem.quantity ||
                                1}
                              {" • "}
                              ₹
                              {Number(
                                firstItem.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          )}

                        </div>
                      </div>

                      {/* PAYMENT */}

                      <div className="lg:min-w-[150px]">

                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                          Payment
                        </p>

                        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                          {order.payment ===
                          "online"
                            ? "Online Payment"
                            : "Cash on Delivery"}
                        </p>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap gap-2 lg:justify-end">

                        <Link
                          to={`/orders/${order.orderId}`}
                          className="px-3 py-2 rounded-lg bg-gray-900 text-white text-xs sm:text-sm font-semibold hover:bg-gray-800 transition"
                        >
                          View Details
                        </Link>

                        {status !==
                          "Cancelled" &&
                          status !==
                            "Delivered" && (
                            <Link
                              to={`/orders/${order.orderId}`}
                              className="px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs sm:text-sm font-semibold hover:bg-blue-100 transition"
                            >
                             Track
                            </Link>
                          )}

                        {/*canCancelOrder(
                          status
                        ) && (
                          <button
                            onClick={() =>
                              handleCancelOrder(
                                order.orderId
                              )
                            }
                            className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs sm:text-sm font-semibold hover:bg-red-100 transition"
                          >
                            Cancel
                          </button>
                        )*/}

                      </div>
                    </div>

                    {/* =================================================
                        MULTIPLE PRODUCTS
                    ================================================= */}

                    {Array.isArray(
                      order.items
                    ) &&
                      order.items.length >
                        1 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">

                          <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-2">
                            {order.items.length}{" "}
                            Products in this order
                          </p>

                          <div className="flex gap-2 overflow-x-auto pb-1">

                            {order.items
                              .slice(1)
                              .map(
                                (
                                  item,
                                  index
                                ) => (
                                  <div
                                    key={`${item.id}-${index}`}
                                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-2 min-w-max"
                                  >

                                    {item.image ? (
                                      <img
                                        src={
                                          item.image
                                        }
                                        alt={
                                          item.name
                                        }
                                        className="w-9 h-9 rounded-md object-cover"
                                      />
                                    ) : (
                                      <div className="w-9 h-9 rounded-md bg-gray-200 flex items-center justify-center text-xs">
                                        📦
                                      </div>
                                    )}

                                    <div>
                                      <p className="text-xs font-medium text-gray-800 max-w-[130px] truncate">
                                        {
                                          item.name
                                        }
                                      </p>

                                      <p className="text-[10px] text-gray-500">
                                        Qty:{" "}
                                        {item.quantity ||
                                          1}
                                      </p>
                                    </div>

                                  </div>
                                )
                              )}

                          </div>
                        </div>
                      )}

                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;