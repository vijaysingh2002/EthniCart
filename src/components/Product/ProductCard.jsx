import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
FiHeart,
FiShoppingBag,
FiStar,
FiArrowUpRight,
} from "react-icons/fi";

import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { cart, increaseQuantity, decreaseQuantity, addToCart } = useContext(CartContext);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  const { user } = useContext(AuthContext);

  const liked = isInWishlist(product.id);

  const cartItem = cart.find(
    (item) => item.id === product.id
  );

  const cartQuantity = cartItem?.quantity || 0;

  const stock = Number(product.stock ?? 0);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  // ---------------------------------------------
  // PRODUCT DETAILS
  // ---------------------------------------------
  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  // ---------------------------------------------
  // WISHLIST
  // ---------------------------------------------
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login", {
        state: {
          from: window.location.pathname,
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

  // ---------------------------------------------
  // ADD TO CART
  // ---------------------------------------------
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      return;
    }

    if (!user) {
      navigate("/login", {
        state: {
          from: "/shop",
        },
      });

      return;
    }

    addToCart(product);
  };

  return ( <article
    onClick={handleProductClick}
    className="group w-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
  >
  {/* =========================================
  IMAGE
  ========================================== */} <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">

  ```
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              !isOutOfStock ? "group-hover:scale-105" : "grayscale-[20%]"
          }`}
      />

      {/* IMAGE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* BADGE */}
      {product.badge && !isOutOfStock && (
        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#C49A6C] text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
          {product.badge}
        </span>
      )}

      {isOutOfStock && (
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gray-900 text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
            Out of Stock
          </span>
        )}

        {/* LOW STOCK BADGE */}
      {isLowStock && (
        <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
          Only {stock} left
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
        className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${
          liked
            ? "bg-[#C49A6C] text-white"
            : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-[#C49A6C] hover:text-white"
        }`}
      >
        <FiHeart
          size={17}
          className={liked ? "fill-current" : ""}
        />
      </button>

      {/* QUICK VIEW */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleProductClick();
        }}
        aria-label="View product"
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-sm text-gray-800 flex items-center justify-center shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
      >
        <FiArrowUpRight size={18} />
      </button>

      {/* DESKTOP ADD TO CART */}
      {cartQuantity === 0 ? (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`hidden sm:flex absolute bottom-3 left-3 right-3 py-3 rounded-xl font-semibold items-center justify-center gap-2 shadow-md transition-all duration-300 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white/95 backdrop-blur-sm text-gray-900 translate-y-16 group-hover:translate-y-0 hover:bg-[#C49A6C] hover:text-white"
          }`}
        >
          <FiShoppingBag size={17} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      ) : (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="hidden sm:flex absolute bottom-3 left-3 right-3 py-2.5 rounded-xl bg-white/95 backdrop-blur-sm shadow-md items-center justify-between px-3 translate-y-16 group-hover:translate-y-0 transition-all duration-300"
        >
          <button
            type="button"
            onClick={() => decreaseQuantity(product.id)}
            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold"
          >
            −
          </button>

          <span className="font-bold text-gray-900">
            {cartQuantity}
          </span>

          <button
            type="button"
            onClick={() => increaseQuantity(product.id)}
            disabled={cartQuantity >= stock}
            className="w-9 h-9 rounded-lg bg-[#C49A6C] hover:bg-[#b78958] text-white flex items-center justify-center text-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      )}

    </div>

    {/* =========================================
        PRODUCT INFO
    ========================================== */}
    <div className="p-3.5 sm:p-5">

      {/* CATEGORY */}
      <p className="text-[10px] sm:text-xs uppercase tracking-[1.5px] text-gray-400 font-medium">
        {product.category}
      </p>

      {/* NAME */}
      <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mt-1 sm:mt-1.5 line-clamp-1">
        {product.name}
      </h3>

      {/* RATING */}
      <div className="flex items-center gap-1.5 mt-2">

        <FiStar
          size={13}
          className="text-[#C49A6C] fill-[#C49A6C] sm:w-[15px] sm:h-[15px]"
        />

        <span className="text-xs sm:text-sm font-medium text-gray-600">
          {product.rating || "4.5"}
        </span>

        {product.reviews && (
          <span className="text-[10px] sm:text-xs text-gray-400">
            ({product.reviews})
          </span>
        )}

      </div>

      {/* PRICE */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5 sm:mt-3">

        <span className="text-base sm:text-xl font-bold text-gray-900">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </span>

        {product.oldPrice && (
          <span className="text-xs sm:text-sm text-gray-400 line-through">
            ₹{Number(product.oldPrice).toLocaleString("en-IN")}
          </span>
        )}

      </div>
        {!isOutOfStock && (
            <p
              className={`text-[10px] sm:text-xs mt-2 font-medium ${
                isLowStock
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {isLowStock
                ? `Only ${stock} left in stock`
                : "In stock"}
            </p>
          )}

      {/* MOBILE ADD TO CART */}
      {cartQuantity === 0 ? (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`sm:hidden w-full mt-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-transform ${
            isOutOfStock
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 text-white active:scale-[0.98]"
          }`}
        >
          <FiShoppingBag size={15} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      ) : (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="sm:hidden w-full mt-3 py-2 rounded-lg bg-gray-900 text-white flex items-center justify-between px-2"
        >
          <button
            type="button"
            onClick={() => decreaseQuantity(product.id)}
            className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-lg font-bold"
          >
            −
          </button>

          <span className="font-bold">
            {cartQuantity}
          </span>

          <button
            type="button"
            onClick={() => increaseQuantity(product.id)}
            disabled={cartQuantity >= stock}
            className="w-8 h-8 rounded-md bg-[#C49A6C] flex items-center justify-center text-lg font-bold disabled:bg-gray-500"
          >
            +
          </button>
        </div>
      )}

    </div>
  </article>

  );
};

export default ProductCard;
