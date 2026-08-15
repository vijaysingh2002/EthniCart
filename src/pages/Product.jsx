import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
} from "react-icons/fi";

//import products from "../data/products";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        const data = await response.json();
        console.log("prod", data);
        if (!response.ok) {
          throw new Error(data.message || "Product not found");
        }

        setProduct(data.product);

        const productsResponse = await fetch(
          `${API_URL}/products`
        );

        const productsData = await productsResponse.json();

        if (productsResponse.ok) {
          const related = productsData.products
            .filter(
              (item) =>
                item.category === data.product.category &&
                String(item.id) !== String(data.product.id)
            )
            .slice(0, 4);

          setRelatedProducts(related);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C49A6C] rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-5">
        <div className="text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-2xl">
            📦
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-5">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-3 leading-6">
            The product you're looking for doesn't exist or may
            have been removed.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 mt-7 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C49A6C] transition"
          >
            <FiArrowLeft />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const liked = isInWishlist(product.id);

  const cartItem = cart.find(
    (item) => String(item.id) === String(product.id)
  );

  const quantity = cartItem?.quantity || 0;

  const stock = Number(product.stock ?? 0);

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const canIncrease = quantity < stock;

  const handleDecreaseQuantity = () => {
  if (quantity > 0) {
    decreaseQuantity(product.id);
  }
};

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/product/${product.id}`,
        },
      });
      
      return;
    }
    
    if (isOutOfStock) {
      return;
    }

    if (quantity >= stock) {
      return;
    }

    addToCart(product);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/product/${product.id}`,
        },
      });
      return;
    }

    if (liked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      return;
    }

    if (quantity > stock) {
      return;
    }

    if (!user) {
      navigate("/login", {
        state: {
          from: `/product/${product.id}`,
        },
      });

      return;
    }

    if (quantity === 0) {
      addToCart(product);
    }

    navigate("/checkout");
  };

  /*const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4);*/

  const totalPrice =
    Number(product.price || 0) * quantity;

  return (
    <main className="min-h-screen bg-[#faf9f7] text-gray-900">

      {/* ================= BREADCRUMB ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link
            to="/"
            className="hover:text-[#C49A6C] transition"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/shop"
            className="hover:text-[#C49A6C] transition"
          >
            Shop
          </Link>

          <span>/</span>

          <span className="text-gray-700 font-medium truncate max-w-[180px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-gray-600 hover:text-[#C49A6C] transition"
        >
          <FiArrowLeft size={16} />
          Back to Shop
        </Link>

      </section>

      {/* ================= PRODUCT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12">

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 items-start">

          {/* ================= IMAGE ================= */}
          <div className="lg:sticky lg:top-24">

            <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm">

              <div className="aspect-[4/5] sm:aspect-[4/5] lg:aspect-[4/5]">

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* BADGE */}
              {product.badge && (
                <span className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[#C49A6C] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}

              {/* WISHLIST */}
              <button
                type="button"
                onClick={handleWishlist}
                aria-label={
                  liked
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className={`absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                  liked
                    ? "bg-[#C49A6C] text-white"
                    : "bg-white/95 text-gray-700 hover:bg-[#C49A6C] hover:text-white"
                }`}
              >
                <FiHeart
                  size={21}
                  className={liked ? "fill-current" : ""}
                />
              </button>

            </div>

            {/* TRUST STRIP */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">

              <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                <FiTruck
                  className="mx-auto text-[#C49A6C]"
                  size={18}
                />
                <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-2">
                  Fast Delivery
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                <FiShield
                  className="mx-auto text-[#C49A6C]"
                  size={18}
                />
                <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-2">
                  Secure Payment
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                <FiRefreshCw
                  className="mx-auto text-[#C49A6C]"
                  size={18}
                />
                <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-2">
                  Easy Returns
                </p>
              </div>

            </div>

          </div>

          {/* ================= DETAILS ================= */}
          <div className="pt-1 lg:pt-4">

            {/* CATEGORY */}
            <p className="text-[#C49A6C] uppercase tracking-[3px] text-xs sm:text-sm font-bold">
              {product.category}
            </p>

            {/* NAME */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mt-3 leading-[1.08] tracking-tight">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex flex-wrap items-center gap-2 mt-5">

              <div className="flex items-center gap-1 text-[#C49A6C]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={16}
                    className="fill-current"
                  />
                ))}
              </div>

              <span className="font-semibold text-gray-800 text-sm">
                {product.rating || "4.5"}
              </span>

              <span className="text-gray-300">
                |
              </span>

              <span className="text-sm text-gray-500">
                Highly rated
              </span>

            </div>

            {/* PRICE */}
            <div className="flex flex-wrap items-center gap-3 mt-6">

              <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {product.oldPrice && (
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                </span>
              )}

              {product.oldPrice && (
                <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1.5 rounded-lg">
                  SPECIAL PRICE
                </span>
              )}

            </div>

            {/* DIVIDER */}
            <div className="border-t border-gray-200 mt-7 pt-7">

              <h2 className="font-bold text-gray-900">
                About this product
              </h2>

              <p className="text-gray-500 leading-7 mt-3 text-sm sm:text-base">
                {product.description ||
                  "Discover premium quality and timeless style with this EthniCart product. Designed with attention to detail and made for comfortable everyday wear."}
              </p>

            </div>

            {/* AVAILABILITY */}
            <div className="flex items-center gap-2 mt-6">

              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOutOfStock
                    ? "bg-red-500"
                    : isLowStock
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
              />

              <span
                className={`text-sm font-semibold ${
                  isOutOfStock
                    ? "text-red-600"
                    : isLowStock
                    ? "text-orange-600"
                    : "text-green-700"
                }`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                  ? `Only ${stock} left`
                  : "In Stock"}
              </span>

              {!isOutOfStock && (
                <span className="text-sm text-gray-400">
                  • Ready to ship
                </span>
              )}

            </div>

            {/* QUANTITY */}
            <div className="mt-7">

              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">
                  Total:{" "}
                  <span className="font-semibold text-gray-700">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </p>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-[1fr_auto] gap-3 mt-7">
              {quantity === 0 ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`min-h-13 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-[#C49A6C]"
                  }`}
                >
                  <FiShoppingBag size={19} />

                  {isOutOfStock
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              )  : (
                <div className="bg-gray-900 text-white min-h-13 rounded-xl font-semibold flex items-center justify-between px-4 shadow-sm">

                  {/* DECREASE */}
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(product.id)}
                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl"
                  >
                    −
                  </button>

                  {/* COUNT */}
                  <span className="text-lg font-bold">
                    {quantity}
                  </span>

                  {/* INCREASE */}
                  <button
                    type="button"
                    onClick={() => increaseQuantity(product.id)}
                    disabled={!canIncrease}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      canIncrease
                        ? "bg-[#C49A6C] hover:bg-[#b78958] text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    +
                  </button>

                </div>
              )}

              {/* WISHLIST */}
              <button
                type="button"
                onClick={handleWishlist}
                aria-label={
                  liked
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className={`w-13 min-h-13 rounded-xl border flex items-center justify-center transition ${
                  liked
                    ? "bg-[#C49A6C] border-[#C49A6C] text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#C49A6C] hover:text-[#C49A6C]"
                }`}
              >
                <FiHeart
                  size={21}
                  className={liked ? "fill-current" : ""}
                />
              </button>

            </div>

            {/* BUY NOW */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`w-full mt-3 min-h-13 rounded-xl text-white font-semibold transition-all duration-300 ${
                isOutOfStock
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#C49A6C] hover:bg-[#a98259]"
              }`}
            >
              {isOutOfStock ? "Available Soon" : "Buy Now"}
            </button>

            {/* PRODUCT INFO */}
            <div className="grid grid-cols-2 gap-3 mt-7">

              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">

                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Category
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {product.category}
                </p>

              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">

                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Availability
                </p>

                <div className="flex items-center gap-1.5 mt-1">
                  <FiCheck
                    size={15}
                    className="text-green-600"
                  />

                  <p className="font-semibold text-green-600">
                    In Stock
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">

          <div className="border-t border-gray-200 pt-10 sm:pt-14">

            <div className="flex items-end justify-between gap-4">

              <div>
                <p className="text-[#C49A6C] uppercase tracking-[3px] text-xs sm:text-sm font-bold">
                  You may also like
                </p>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
                  Related Products
                </h2>
              </div>

              <Link
                to="/shop"
                className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-[#C49A6C] transition"
              >
                View All →
              </Link>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 mt-7 sm:mt-9">

              {relatedProducts.map((item) => (

                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                >

                  <div className="aspect-[4/5] overflow-hidden bg-gray-100">

                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                  </div>

                  <div className="p-3 sm:p-5">

                    <p className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-400">
                      {item.category}
                    </p>

                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mt-1 line-clamp-1 group-hover:text-[#C49A6C] transition">
                      {item.name}
                    </h3>

                    <p className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

            <Link
              to="/shop"
              className="sm:hidden flex items-center justify-center mt-6 w-full py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800"
            >
              View All Products
            </Link>

          </div>

        </section>
      )}

    </main>
  );
};

export default Product;