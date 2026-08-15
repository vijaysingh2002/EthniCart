import { Link, useLocation } from "react-router-dom";
import {
  FiCheckCircle,
  FiShoppingBag,
  FiPackage,
  FiArrowRight,
  FiHome,
} from "react-icons/fi";

const OrderSuccess = () => {
  const { state } = useLocation();

  const order = state?.order;

  return (
    <main className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">

      <div className="max-w-2xl w-full">

        {/* SUCCESS CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* TOP SUCCESS AREA */}
          <div className="text-center px-6 sm:px-10 pt-10 sm:pt-14">

            {/* SUCCESS ICON */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">

              <div className="absolute inset-0 rounded-full bg-green-100 animate-pulse" />

              <div className="relative w-full h-full rounded-full bg-green-50 flex items-center justify-center">
                <FiCheckCircle
                  size={48}
                  className="text-green-500 sm:w-[54px] sm:h-[54px]"
                />
              </div>

            </div>

            {/* BRAND */}
            <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold text-xs sm:text-sm mt-7">
              EthniCart
            </p>

            {/* TITLE */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Order Confirmed!
            </h1>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-sm sm:text-base leading-7 max-w-lg mx-auto mt-4">
              Thank you for shopping with EthniCart. Your order has been
              successfully placed and is now being processed.
            </p>

          </div>

          {/* ORDER DETAILS */}
          {order ? (
            <div className="px-6 sm:px-10 pb-8 sm:pb-10">

              {/* ORDER INFO */}
              <div className="bg-[#F8F5F0] rounded-2xl p-5 sm:p-6 mt-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* ORDER ID */}
                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <FiPackage
                        size={19}
                        className="text-[#C49A6C]"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                        Order ID
                      </p>

                      <p className="font-bold text-gray-900 mt-1 break-all">
                        {order[0].orderId}
                      </p>
                    </div>

                  </div>

                  {/* STATUS */}
                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <FiCheckCircle
                        size={19}
                        className="text-green-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                        Status
                      </p>

                      <span className="inline-flex items-center mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        {order[0].status || "Pending"}
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* ORDER SUMMARY */}
              <div className="border-t border-gray-200 mt-7 pt-6">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order Total
                    </p>

                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                      ₹{Number(order[0].total || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-500">
                      Payment
                    </p>

                    <p className="font-semibold text-gray-900 mt-1 capitalize">
                      {order[0].payment === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>

                  </div>

                </div>

              </div>

              {/* ITEMS COUNT */}
              {order.items?.length > 0 && (
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mt-5 text-sm">

                  <span className="text-gray-500">
                    Products in this order
                  </span>

                  <span className="font-semibold text-gray-900">
                    {order.items.reduce(
                      (total, item) =>
                        total + Number(item.quantity || 0),
                      0
                    )}
                  </span>

                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

                <Link
                  to="/orders"
                  className="group bg-[#C49A6C] text-white py-3.5 px-5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#A98259] transition-all"
                >
                  <FiPackage size={18} />
                  View My Orders
                  <FiArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  to="/shop"
                  className="border border-gray-200 bg-white text-gray-700 py-3.5 px-5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:border-[#C49A6C] hover:text-[#C49A6C] transition-all"
                >
                  <FiShoppingBag size={18} />
                  Continue Shopping
                </Link>

              </div>

              {/* HOME */}
              <Link
                to="/"
                className="flex items-center justify-center gap-2 mt-5 text-sm font-medium text-gray-400 hover:text-gray-700 transition"
              >
                <FiHome size={16} />
                Back to Home
              </Link>

            </div>
          ) : (

            /* NO ORDER STATE */
            <div className="px-6 sm:px-10 pb-10 text-center">

              <div className="bg-[#F8F5F0] rounded-2xl p-5 mt-8">

                <p className="text-gray-500 text-sm">
                  We couldn't find order details for this page.
                </p>

              </div>

              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 mt-6 bg-[#C49A6C] text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-[#A98259] transition"
              >
                <FiPackage size={18} />
                View My Orders
              </Link>

            </div>
          )}

        </div>

      </div>

    </main>
  );
};

export default OrderSuccess;