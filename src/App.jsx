import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess";
import Addresses from "./pages/Addresses";
import AccountSettings from "./pages/AccountSettings";
import HelpSupport from "./pages/HelpSupport";

// Profile
import Profile from "./components/Home/Profile";

// Authentication
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Admin
import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProtectedRoute from "./components/Admin/ProtectedRoute";


// =========================
// USER LAYOUT
// =========================
const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};


const RootPage = () => {
  const { user } = useContext(AuthContext);

  return user ? <Shop /> : <Home />;
};
// =========================
// APP
// =========================
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            USER ROUTES
        ========================= */}

        <Route element={<UserLayout />}>

          {/* PUBLIC */}

          <Route path="/" element={<RootPage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* =========================
              PROTECTED USER ROUTES
          ========================= */}

          <Route
            path="/shop"
            element={
              <Navigate to="/" replace />
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          {/* =========================
              ACCOUNT PAGES
          ========================= */}

          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <Addresses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account-settings"
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* =========================
            ADMIN
        ========================= */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/adminpage"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/help-support" element={<HelpSupport />} />

        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;