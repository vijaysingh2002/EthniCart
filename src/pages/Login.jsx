import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setForgotLoading(true);
    setForgotMessage("");
    setError("");
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: forgotPhone,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setForgotMessage(
        "A password reset link has been sent to your registered email address. Please check your email."
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Unable to send reset link. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const result = await login(
        form.phone,
        form.password
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      // Redirect to previous page or shop
      const from = location.state?.from || "/";

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-lg grid md:grid-cols-2 min-h-[650px]">

        {/* Left Side */}
        <div className="hidden md:flex relative">

          <img
            src="login.jpeg"
            alt="Fashion"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35"></div>

          <div className="absolute bottom-10 left-10 text-white">

            <h1 className="text-5xl font-bold leading-tight">
              Welcome to <br />

              <span className="text-[#F4C95D]">
                EthniCart
              </span>
            </h1>

            <p className="mt-5 text-lg text-gray-200 max-w-sm">
              Discover premium ethnic fashion crafted
              for every occasion.
            </p>

          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-14 flex items-center">

          <div className="w-full">

            {/* Heading */}
            {!forgotLoading && <div className="mb-10">

              <h2 className="text-4xl font-bold text-gray-800">
                Sign In
              </h2>

              <p className="text-gray-500 mt-2">
                Login to continue shopping.
              </p>

            </div>}

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            {forgotPassword ? (
              <form
                onSubmit={handleForgotPassword}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Forgot Password?
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Enter your registered phone number and we'll send
                    you a password reset link.
                  </p>
                </div>

                {forgotMessage && (
                  <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-600 text-sm">
                    {forgotMessage}
                  </div>
                )}

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Phone Number
                  </label>
                <input
                    type="tel"
                    placeholder="Enter your registered phone number"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-3 ${
                    forgotLoading
                      ? "bg-[#C49A6C]/70 cursor-not-allowed"
                      : "bg-[#C49A6C] hover:bg-[#b78958]"
                  }`}
                >
                  {forgotLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPassword(false);
                    setForgotMessage("");
                    setError("");
                  }}
                  className="w-full text-sm text-gray-600 hover:text-[#C49A6C]"
                  >
                  ← Back to Login
                </button>
              </form>
      ) : (<form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Phone Number */}
              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                />

              </div>

              {/* Password */}
              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
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
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

              {/* Remember */}
              <div className="flex justify-between items-center text-sm">

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                  />

                  Remember me

                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotPassword(true);
                    setError("");
                    setForgotMessage("");
                  }}
                  className="text-sm font-medium text-[#C49A6C] hover:underline"
                >
                  Forgot Password?
                </button>

              </div>

              {/* Login */}
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
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

            </form>)}

            {/* Divider */}
            <div className="flex items-center my-8">

              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="px-4 text-gray-500">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>

            </div>

          

            {/* Register */}
            <p className="text-center mt-8 text-gray-600">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-[#C49A6C]"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Login;