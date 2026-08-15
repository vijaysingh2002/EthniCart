import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem("adminAuth", "true");
            navigate("/adminpage");
        } else {
            setError("Not Authorized");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gray-200 rounded-lg p-3 text-gray-800">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mt-4 mb-6 text-sm sm:text-base">
                    Login to your account
                </p>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-center text-red-700 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;