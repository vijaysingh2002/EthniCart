import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import ProductCard from "../Product/ProductCard";

const API_URL = import.meta.env.VITE_API_URL;

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Featured products error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7 sm:mb-9">

        <div>
          <p className="text-[#C49A6C] uppercase tracking-[3px] font-semibold text-xs sm:text-sm">
            Our Collection
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
            Featured Products
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl text-sm sm:text-base leading-6">
            Handpicked ethnic styles designed to make every
            occasion special.
          </p>
        </div>

        {/* DESKTOP VIEW ALL */}
        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#C49A6C] transition-colors"
        >
          View All Products
          <FiArrowUpRight size={17} />
        </Link>

      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-7">

        {products.slice(0, 6).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

      {/* MOBILE VIEW ALL */}
      <Link
        to="/shop"
        className="
          sm:hidden
          flex
          items-center
          justify-center
          gap-2
          mt-6
          w-full
          bg-gray-900
          text-white
          py-3.5
          rounded-xl
          text-sm
          font-semibold
          hover:bg-[#C49A6C]
          transition
        "
      >
        View All Products
        <FiArrowUpRight size={17} />
      </Link>

    </section>
  );
};

export default FeaturedProducts;