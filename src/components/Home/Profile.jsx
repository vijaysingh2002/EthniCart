import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiTag,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiEdit2,
  FiX,
  FiSave,
  FiPhone,
  FiMail,
} from "react-icons/fi";

import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // =====================================================
  // EDIT PROFILE STATE
  // =====================================================

  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // =====================================================
  // CHANGE PASSWORD STATE
  // =====================================================

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // =====================================================
  // LOAD ORDERS + WISHLIST
  // =====================================================

  useEffect(() => {
    const loadData = () => {
      const orderKeys = [
        "ethnicart_orders",
        "ethniCart_orders",
        "orders",
        "ethnicartOrders",
      ];

      let orderData = [];

      for (const key of orderKeys) {
        try {
          const saved = localStorage.getItem(key);

          if (saved) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
              orderData = parsed;
              break;
            }
          }
        } catch {
          // Ignore invalid localStorage data
        }
      }

      setOrders(orderData);

      const wishlistKeys = [
        "ethnicart_wishlist",
        "ethniCart_wishlist",
        "wishlist",
        "ethnicartWishlist",
      ];

      let wishlistData = [];

      for (const key of wishlistKeys) {
        try {
          const saved = localStorage.getItem(key);

          if (saved) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
              wishlistData = parsed;
              break;
            }
          }
        } catch {
          // Ignore invalid localStorage data
        }
      }

      setWishlistCount(wishlistData.length);
    };

    loadData();

    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // =====================================================
  // OPEN EDIT PROFILE
  // =====================================================

  const handleOpenEditProfile = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      location: user?.location || "",
    });

    setProfileMessage("");
    setProfileError("");
    setShowEditModal(true);
  };

  // =====================================================
  // CLOSE EDIT PROFILE
  // =====================================================

  const handleCloseEditProfile = () => {
    if (savingProfile) return;

    setShowEditModal(false);
    setProfileMessage("");
    setProfileError("");
  };

  // =====================================================
  // PROFILE INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const location = formData.location.trim();

    if (!name) {
      setProfileError("Name is required.");
      return;
    }

    if (!phone) {
      setProfileError("Phone number is required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setProfileError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!location) {
      setProfileError("Location is required.");
      return;
    }

    setSavingProfile(true);

    try {
      const result = await updateUser({
        name,
        phone,
        location,
      });

      if (!result?.success) {
        setProfileError(
          result?.message || "Failed to update your profile."
        );
        return;
      }

      setProfileMessage("Profile updated successfully.");

      setTimeout(() => {
        setShowEditModal(false);
        setProfileMessage("");
      }, 1000);
    } catch (error) {
      console.error("Profile update error:", error);

      setProfileError(
        "Something went wrong while updating your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // =====================================================
  // OPEN CHANGE PASSWORD
  // =====================================================

  const handleOpenPasswordModal = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordMessage("");
    setPasswordError("");
    setShowPasswordModal(true);
  };

  // =====================================================
  // CLOSE CHANGE PASSWORD
  // =====================================================

  const handleClosePasswordModal = () => {
    if (changingPassword) return;

    setShowPasswordModal(false);
    setPasswordMessage("");
    setPasswordError("");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // =====================================================
  // PASSWORD INPUT CHANGE
  // =====================================================

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    const currentPassword = passwordData.currentPassword;
    const newPassword = passwordData.newPassword;
    const confirmPassword = passwordData.confirmPassword;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setPasswordError("Please login again.");
        return;
      }

      const response = await fetch(
        "https://ethnicart.onrender.com/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setPasswordError(
          result?.message || "Failed to change password."
        );
        return;
      }

      setPasswordMessage("Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMessage("");
      }, 1200);
    } catch (error) {
      console.error("Change password error:", error);

      setPasswordError(
        "Something went wrong while changing your password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#C49A6C]/10 flex items-center justify-center">
            <FiUser size={28} className="text-[#C49A6C]" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-5">
            Login to your account
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Login to manage your orders, wishlist and account.
          </p>

          <Link
            to="/login"
            className="mt-6 w-full flex items-center justify-center bg-[#C49A6C] text-white py-3 rounded-md font-semibold hover:bg-[#a98259] transition"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // USER DATA
  // =====================================================

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  // =====================================================
  // ACCOUNT CARDS
  // =====================================================

  const accountCards = [
    {
      title: "Login & Security",
      description: "Manage your password and account security",
      icon: FiLock,
      action: handleOpenPasswordModal,
      type: "action",
    },
    {
      title: "Your Orders",
      description:
        orders.length > 0
          ? `${orders.length} order${
              orders.length > 1 ? "s" : ""
            } placed`
          : "Track and manage your orders",
      icon: FiPackage,
      link: "/orders",
      type: "link",
    },
    {
      title: "Your Wishlist",
      description:
        wishlistCount > 0
          ? `${wishlistCount} item${
              wishlistCount > 1 ? "s" : ""
            } saved`
          : "View products saved for later",
      icon: FiHeart,
      link: "/wishlist",
      type: "link",
    },
    {
      title: "Account Settings",
      description: "Manage your account preferences",
      icon: FiSettings,
      link: "/account-settings",
      type: "link",
    },
    {
       title: "Help & Support",
       description: "Get help with your EthniCart account",
       icon: FiHelpCircle,
       link: "/help-support",
       type: "link",
    },
    {
      title: "Your Addresses",
      description: "Manage your delivery addresses",
      icon: FiMapPin,
      link: "/addresses",
      type: "disabled",
    },
    {
      title: "Payment Methods",
      description: "Manage your saved payment options",
      icon: FiCreditCard,
      type: "disabled",
    },
    {
      title: "Coupons & Offers",
      description: "View available discounts and offers",
      icon: FiTag,
      type: "disabled",
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#f6f6f6]">
        {/* HEADER */}

        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
            <p className="text-xs sm:text-sm text-gray-500">
              Account
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              My Account
            </h1>
          </div>
        </section>

        {/* MAIN */}

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* PROFILE SUMMARY */}

          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#C49A6C] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {firstLetter}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {user.name}
                </h2>

                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-sm text-gray-500 break-all flex items-center gap-2">
                    <FiMail size={14} className="flex-shrink-0" />
                    {user.email}
                  </p>

                  {user.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FiPhone
                        size={14}
                        className="flex-shrink-0"
                      />
                      {user.phone}
                    </p>
                  )}

                  {user.location && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FiMapPin
                        size={14}
                        className="flex-shrink-0"
                      />
                      {user.location}
                    </p>
                  )}
                </div>

                <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Account Active
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenEditProfile}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#C49A6C] text-[#C49A6C] px-5 py-2.5 rounded-md font-semibold hover:bg-[#C49A6C] hover:text-white transition"
              >
                <FiEdit2 size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* ACCOUNT CARDS */}

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 sm:px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Your Account
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage your account and shopping activity
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {accountCards.map((card, index) => {
                const Icon = card.icon;

                const isActive =
                  card.type === "link" ||
                  card.type === "action";

                const cardContent = (
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? "bg-[#C49A6C]/10"
                          : "bg-gray-50"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={
                          isActive
                            ? "text-[#C49A6C]"
                            : "text-gray-500"
                        }
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {card.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 leading-5">
                        {card.description}
                      </p>

                      {card.type === "disabled" && (
                        <span className="inline-block text-[10px] uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-1 rounded mt-3">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    <FiChevronRight
                      size={18}
                      className={
                        isActive
                          ? "text-gray-400 group-hover:text-[#C49A6C] transition flex-shrink-0"
                          : "text-gray-300 flex-shrink-0"
                      }
                    />
                  </div>
                );

                const borderClass = `
                  border-gray-200
                  ${
                    index < accountCards.length - 3
                      ? "lg:border-b"
                      : ""
                  }
                  ${
                    index % 3 !== 2
                      ? "lg:border-r"
                      : ""
                  }
                  sm:border-b
                `;

                if (card.type === "link") {
                  return (
                    <Link
                      key={card.title}
                      to={card.link}
                      className={`group p-5 sm:p-6 text-left hover:bg-[#faf9f7] transition ${borderClass}`}
                    >
                      {cardContent}
                    </Link>
                  );
                }

                if (card.type === "action") {
                  return (
                    <button
                      key={card.title}
                      type="button"
                      onClick={card.action}
                      className={`group w-full p-5 sm:p-6 text-left hover:bg-[#faf9f7] transition ${borderClass}`}
                    >
                      {cardContent}
                    </button>
                  );
                }

                return (
                  <div
                    key={card.title}
                    className={`p-5 sm:p-6 text-left opacity-75 ${borderClass}`}
                  >
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SHOPPING SUMMARY */}

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Link
              to="/orders"
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[#C49A6C] transition"
            >
              <div className="flex items-center justify-between">
                <FiPackage
                  size={21}
                  className="text-[#C49A6C]"
                />

                <FiChevronRight className="text-gray-300" />
              </div>

              <p className="text-2xl font-bold text-gray-900 mt-4">
                {orders.length}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Orders
              </p>
            </Link>

            <Link
              to="/wishlist"
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[#C49A6C] transition"
            >
              <div className="flex items-center justify-between">
                <FiHeart
                  size={21}
                  className="text-[#C49A6C]"
                />

                <FiChevronRight className="text-gray-300" />
              </div>

              <p className="text-2xl font-bold text-gray-900 mt-4">
                {wishlistCount}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Wishlist
              </p>
            </Link>

            <div className="col-span-2 sm:col-span-1 bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <FiUser
                  size={21}
                  className="text-[#C49A6C]"
                />
              </div>

              <p className="text-base font-bold text-gray-900 mt-5">
                Customer
              </p>

              <p className="text-sm text-gray-500 mt-1">
                EthniCart Member
              </p>
            </div>
          </div>

          {/* LOGOUT */}

          <div className="mt-5 bg-white border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-5 py-4 flex items-center justify-between text-red-500 hover:bg-red-50 transition rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FiLogOut size={19} />

                <span className="font-semibold">
                  Logout
                </span>
              </div>

              <FiChevronRight />
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            EthniCart Account Center
          </p>
        </section>
      </main>

      {/* EDIT PROFILE MODAL */}

      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseEditProfile();
            }
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Profile
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update your account information
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEditProfile}
                disabled={savingProfile}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateProfile}
              className="p-5 sm:p-6"
            >
              {profileMessage && (
                <div className="mb-5 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  {profileMessage}
                </div>
              )}

              {profileError && (
                <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {profileError}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="profile-name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>

                <div className="relative">
                  <FiUser
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={savingProfile}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="profile-email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">
                  <FiMail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-md pl-10 pr-4 py-3 text-sm outline-none cursor-not-allowed"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1.5">
                  Email address cannot be changed here.
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="profile-phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <FiPhone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      }))
                    }
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    disabled={savingProfile}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="profile-location"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Location
                </label>

                <div className="relative">
                  <FiMapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                    disabled={savingProfile}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditProfile}
                  disabled={savingProfile}
                  className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full sm:flex-1 bg-[#C49A6C] text-white py-3 rounded-md font-semibold hover:bg-[#a98259] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingProfile ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}

      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleClosePasswordModal();
            }
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Change Password
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Keep your account secure with a strong password.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClosePasswordModal}
                disabled={changingPassword}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="p-5 sm:p-6"
            >
              {passwordMessage && (
                <div className="mb-5 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  {passwordMessage}
                </div>
              )}

              {passwordError && (
                <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {passwordError}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="current-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Current Password
                </label>

                <div className="relative">
                  <FiLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="current-password"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter current password"
                    disabled={changingPassword}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  New Password
                </label>

                <div className="relative">
                  <FiLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="new-password"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter new password"
                    disabled={changingPassword}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1.5">
                  Password must be at least 6 characters.
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <FiLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm new password"
                    disabled={changingPassword}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  disabled={changingPassword}
                  className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full sm:flex-1 bg-[#C49A6C] text-white py-3 rounded-md font-semibold hover:bg-[#a98259] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {changingPassword ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave size={17} />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;