import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FiShoppingBag,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiHeart,
  FiMenu,
  FiX,
  FiPackage,
  FiHome,
  FiGrid,
  FiUser,
} from "react-icons/fi";

import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // =====================================================
  // CART COUNT
  // =====================================================

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  // =====================================================
  // DESKTOP NAV STYLE
  // =====================================================

  const desktopNavClass = ({ isActive }) =>
    `flex items-center gap-2 font-medium transition ${
      isActive
        ? "text-[#C49A6C]"
        : "text-gray-700 hover:text-[#C49A6C]"
    }`;

  // =====================================================
  // MOBILE NAV STYLE
  // =====================================================

  const mobileNavClass = ({ isActive }) =>
    `flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-lg text-[13px] font-semibold transition ${
      isActive
        ? "bg-[#C49A6C] text-white"
        : "text-gray-600 hover:text-[#C49A6C]"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <div className="max-w-7xl mx-auto">

        <div className="h-[64px] sm:h-[72px] px-3 sm:px-6 flex items-center justify-between gap-2">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="shrink-0"
          >
            <h1 className="text-[25px] sm:text-3xl font-bold tracking-tight text-[#C49A6C] whitespace-nowrap">
              EthniCart
            </h1>
          </Link>

          {/* =================================================
              DESKTOP MENU
          ================================================= */}

          <div className="hidden lg:flex items-center gap-7">

            <NavLink
              to="/"
              className={desktopNavClass}
            >
              <FiHome size={17} />
              Home
            </NavLink>

            <NavLink
              to="/wishlist"
              className={desktopNavClass}
            >
              <FiHeart size={17} />
              Wishlist
            </NavLink>

            {user && (
              <NavLink
                to="/orders"
                className={desktopNavClass}
              >
                <FiPackage size={17} />
                Orders
              </NavLink>
            )}

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-2 shrink-0">

            {/* =================================================
                DESKTOP USER
            ================================================= */}

            <div className="hidden lg:block relative">

              {user ? (
                <>

                  <button
                    type="button"
                    onClick={() =>
                      setIsUserMenuOpen(!isUserMenuOpen)
                    }
                    className="flex items-center gap-2 max-w-[170px] border border-gray-200 px-3 py-2 rounded-xl hover:border-[#C49A6C] transition"
                  >
                    <FiUser size={18} />

                    <span className="truncate font-medium">
                      {user.name || "Account"}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-14 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">

                      <Link
                        to="/profile"
                        onClick={() =>
                          setIsUserMenuOpen(false)
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                      >
                        <FiUser size={18} />
                        Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() =>
                          setIsUserMenuOpen(false)
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                      >
                        <FiPackage size={18} />
                        My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() =>
                          setIsUserMenuOpen(false)
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                      >
                        <FiHeart size={18} />
                        Wishlist
                      </Link>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50"
                      >
                        <FiLogOut size={18} />
                        Logout
                      </button>

                    </div>
                  )}

                </>
              ) : (
                <div className="flex items-center gap-2">
                  {/* LOGIN */}
                  <Link
                    to="/login"
                    className="flex items-center gap-2 border border-[#C49A6C] text-[#C49A6C] px-4 py-2 rounded-xl font-semibold hover:bg-[#C49A6C] hover:text-white transition"
                  >
                    <FiUser size={18} />
                    Login
                  </Link>

                  {/* NEW USER */}
                  <Link
                    to="/register"
                    className="flex items-center gap-2 bg-[#C49A6C] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#a98259] transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* =================================================
                CART
            ================================================= */}

            {user && (
            <>
              <Link
              to="/cart"
              className="relative w-10 h-10 sm:w-auto sm:px-4 rounded-xl bg-[#C49A6C] text-white flex items-center justify-center gap-2 hover:bg-[#a98259] transition shrink-0"
              aria-label="Shopping Cart"
            >
              <FiShoppingBag size={19} />

              <span className="hidden sm:inline font-semibold">
                Cart
              </span>

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
            </>)}

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              className="lg:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 shrink-0"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <FiX size={21} />
              ) : (
                <FiMenu size={21} />
              )}
            </button>

          </div>

        </div>

        {/* =====================================================
            MOBILE DIRECT NAVIGATION
        ===================================================== */}

        <div className="lg:hidden border-t border-gray-100 px-2 py-2">

          <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">

            {/* HOME */}

            <NavLink
              to="/"
              className={mobileNavClass}
            >
              <FiHome size={15} />
              Home
            </NavLink>

            {!user && (<NavLink
              to="/login"
              className={mobileNavClass}
            >
              <FiLogIn size={15} />
              Login
            </NavLink>)}

            {!user && (<NavLink
              to="/register"
              className={mobileNavClass}
            >
              <FiUser size={15} />
              SignUp
            </NavLink>)}

            {user && (
              <NavLink
                to="/wishlist"
                className={mobileNavClass}
              >
                <FiHeart size={15} />
                Wishlist
              </NavLink>
            )}
            
            {/* ORDERS */}

            {user && (
              <NavLink
                to="/orders"
                className={mobileNavClass}
              >
                <FiPackage size={15} />
                Orders
              </NavLink>
            )}

          </div>

        </div>

        {/* =====================================================
            MOBILE ACCOUNT MENU
        ===================================================== */}

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-3 py-4">

            {user ? (
              <div className="space-y-1">

                {/* ACCOUNT */}

                <div className="bg-[#F8F5F0] rounded-xl px-4 py-3 mb-2">

                  <p className="text-[10px] uppercase tracking-[2px] text-[#C49A6C] font-bold">
                    Account
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {user.name || "User"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {user.email || ""}
                  </p>

                </div>

                {/* PROFILE */}

                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  <FiUser size={19} />
                  Profile
                </Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
                >
                  <FiLogOut size={19} />
                  Logout
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 bg-[#C49A6C] text-white px-4 py-3 rounded-xl font-semibold"
              >
                <FiUser size={18} />
                Login
              </Link>
            )}

          </div>
        )}

      </div>

    </nav>
  );
};

export default Navbar;