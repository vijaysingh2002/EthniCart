import { useMemo, useState, useEffect } from "react";
import {
  FiChevronDown,
  FiSearch,
  FiSliders,
  FiX,
} from "react-icons/fi";

import ProductCard from "../components/Product/ProductCard";

const API_URL = import.meta.env.VITE_API_URL;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All", "Saree", "Lehenga", "Suit"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Product fetch error:", error);
        setError(error.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((product) => {
        const matchesCategory =
          category === "All" || product.category === category;

        const searchText = search.trim().toLowerCase();

        const matchesSearch =
          !searchText ||
          product.name?.toLowerCase().includes(searchText) ||
          product.category?.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "low") {
          return Number(a.price) - Number(b.price);
        }

        if (sort === "high") {
          return Number(b.price) - Number(a.price);
        }

        return 0;
      });
  }, [products, category, sort, search]);

  const clearFilters = () => {
    setCategory("All");
    setSort("default");
    setSearch("");
  };

  const hasFilters =
    category !== "All" || search.trim() !== "" || sort !== "default";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF9F7]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

          {/* Header Skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
            <div className="h-9 w-28 bg-gray-200 rounded-lg mb-3" />
            <div className="h-4 w-72 bg-gray-200 rounded" />
          </div>

          {/* Search Skeleton */}
          <div className="h-14 bg-gray-200 rounded-2xl mb-5 animate-pulse" />

          {/* Filter Skeleton */}
          <div className="flex justify-between items-center mb-8 animate-pulse">
            <div className="flex gap-5">
              <div className="h-5 w-14 bg-gray-200 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>

            <div className="h-11 w-40 bg-gray-200 rounded-xl" />
          </div>

          {/* Product Skeletons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                {/* Product Image */}
                <div className="aspect-[4/5] bg-gray-200" />

                {/* Product Info */}
                <div className="p-4">
                  <div className="h-3 w-16 bg-gray-200 rounded mb-3" />

                  <div className="h-4 w-4/5 bg-gray-200 rounded mb-3" />

                  <div className="h-4 w-20 bg-gray-200 rounded mb-4" />

                  <div className="h-10 w-full bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#FAF9F7]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto bg-white border border-red-100 rounded-3xl p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
              <FiX size={22} className="text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              Unable to load products
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 bg-gray-900 hover:bg-[#C49A6C] text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F7]">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* =================================================
            SIMPLE HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7 sm:mb-9">

          <div>
            <p className="text-[#C49A6C] uppercase tracking-[2.5px] text-[10px] sm:text-xs font-bold mb-2">
              EthniCart Collection
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Shop
            </h1>

            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Explore our latest ethnic collection.
            </p>
          </div>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="relative mb-5">

          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="
              w-full
              h-14
              bg-white
              border
              border-gray-200
              rounded-2xl
              pl-11
              pr-12
              text-sm
              text-gray-900
              placeholder:text-gray-400
              outline-none
              focus:border-[#C49A6C]
              focus:ring-2
              focus:ring-[#C49A6C]/10
              transition
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                w-9
                h-9
                rounded-full
                flex
                items-center
                justify-center
                text-gray-400
                hover:bg-gray-100
                hover:text-gray-700
                transition
              "
              aria-label="Clear search"
            >
              <FiX size={17} />
            </button>
          )}

        </div>

        {/* =================================================
            CATEGORY + SORT
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          {/* Categories */}

          <div className="flex items-center gap-4 min-w-0">

            <div className="hidden md:flex items-center gap-2 text-gray-400 shrink-0">
              <FiSliders size={15} />

              <span className="text-xs font-semibold uppercase tracking-wider">
                Category
              </span>
            </div>

            <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide">

              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`
                    relative
                    shrink-0
                    pb-2
                    text-sm
                    font-semibold
                    transition
                    ${
                      category === item
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                    }
                  `}
                >
                  {item}

                  {category === item && (
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#C49A6C] rounded-full" />
                  )}
                </button>
              ))}

            </div>

          </div>

          {/* Sort */}

          <div className="relative shrink-0">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="
                appearance-none
                w-full
                sm:w-48
                h-11
                bg-white
                border
                border-gray-200
                rounded-xl
                px-4
                pr-10
                text-sm
                font-medium
                text-gray-700
                outline-none
                focus:border-[#C49A6C]
                cursor-pointer
              "
            >
              <option value="default">
                Sort: Featured
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>
            </select>

            <FiChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

          </div>

        </div>

        {/* =================================================
            ACTIVE FILTERS
        ================================================= */}

        {hasFilters && (
          <div className="flex items-center justify-between gap-3 mb-6">

            <div className="flex flex-wrap items-center gap-2">

              {category !== "All" && (
                <span className="inline-flex items-center gap-1.5 bg-[#C49A6C]/10 text-[#9B7045] px-3 py-1.5 rounded-full text-xs font-semibold">
                  {category}

                  <button
                    type="button"
                    onClick={() => setCategory("All")}
                    aria-label="Remove category"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              )}

              {search.trim() && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold max-w-[200px]">
                  <span className="truncate">
                    "{search.trim()}"
                  </span>

                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Remove search"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              )}

            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-gray-500 hover:text-[#C49A6C] whitespace-nowrap"
            >
              Clear all
            </button>

          </div>
        )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        ) : (

          <div className="bg-white border border-gray-200 rounded-3xl py-16 px-5 text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <FiSearch size={22} className="text-gray-400" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              No products found
            </h2>

            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
              Try changing your search or selected category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="
                mt-6
                bg-gray-900
                hover:bg-[#C49A6C]
                text-white
                px-6
                py-3
                rounded-xl
                text-sm
                font-semibold
                transition
              "
            >
              Clear Filters
            </button>

          </div>

        )}

      </section>

    </main>
  );
};
export default Shop;