import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Password match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Password length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await register(
        form.name,
        form.phone,
        form.location,
        form.email,
        form.password
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      // Registration successful
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-lg grid md:grid-cols-2 min-h-[700px]">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="hidden md:flex relative">

          <img
            src="/register.jpeg"
            alt="Ethnic Fashion"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35"></div>

          <div className="absolute bottom-10 left-10 text-white">

            <h1 className="text-5xl font-bold leading-tight">
              Join <br />

              <span className="text-[#F4C95D]">
                EthniCart
              </span>
            </h1>

            <p className="mt-5 text-lg text-gray-200 max-w-sm">
              Create your account and discover
              beautiful ethnic fashion for every occasion.
            </p>

          </div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="p-8 md:p-14 flex items-center">

          <div className="w-full">

            {/* Heading */}

            <div className="mb-8">

              <h2 className="text-4xl font-bold text-gray-800">
                Create Account
              </h2>

              <p className="text-gray-500 mt-2">
                Register to start shopping with EthniCart.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* =========================
                  NAME
              ========================= */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                />

              </div>

              {/* =========================
                  PHONE
              ========================= */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                />

              </div>

              {/* =========================
                  LOCATION
              ========================= */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter your city / location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                />

              </div>

              {/* =========================
                  EMAIL
              ========================= */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                />

              </div>

              {/* =========================
                  PASSWORD
              ========================= */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 pr-14 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>

                </div>

              </div>

              {/* =========================
                  CONFIRM PASSWORD
              ========================= */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 pr-14 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

              {/* =========================
                  REGISTER BUTTON
              ========================= */}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition flex items-center justify-center gap-3 ${
                  loading
                    ? "bg-[#C49A6C]/70 cursor-not-allowed"
                    : "bg-[#C49A6C] hover:bg-[#b78958]"
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

            </form>

            {/* =========================
                LOGIN
            ========================= */}

            <p className="text-center mt-8 text-gray-600">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-[#C49A6C] hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Register;