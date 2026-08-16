import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const API_URL = "https://ethnicart.onrender.com/api";
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("adminToken");
    
    useEffect(() =>{
        if(token) {
        navigate("/adminpage")
    }
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        mobile,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Not Authorized");
                return;
            }

            // Store JWT token
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("admin", JSON.stringify(data.admin));

            // Optional: store admin details
            localStorage.setItem(
                "admin",
                JSON.stringify(data.admin)
            );

            navigate("/adminpage");

        } catch (error) {
            console.error("Login error:", error);
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
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

                    {/* Mobile */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Mobile Number
                        </label>

                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Enter your mobile number"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Password */}
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

                    {/* Login button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-lg py-3 text-white font-semibold transition active:scale-[0.98] ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default AdminLogin;