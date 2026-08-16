import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_PRODUCTS = [];

const INITIAL_ORDERS = [];

const INITIAL_CUSTOMERS = [];

const PRODUCT_CATEGORIES = ["Saree", "Lehenga", "Suit"];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    () => sessionStorage.getItem("adminActiveTab") || "dashboard"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [salesView, setSalesView] = useState("weekly");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers, setCustomers] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Form & Image Upload States
  const [newProd, setNewProd] = useState({ name: "", price: "", oldPrice: "", category: "", rating: "", stock: "", badge: "", description: "" });
  const [newProdFile, setNewProdFile] = useState(null);
  const [newProdPreview, setNewProdPreview] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [editingProd, setEditingProd] = useState(null);
  const [editProdFile, setEditProdFile] = useState(null);
  const [editProdPreview, setEditProdPreview] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  //GET USERS FROM BACKEND
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);

        const token = localStorage.getItem("adminToken");

        if (!token) {
          console.error("No authentication token found");
          return;
        }
        //
        const response = await fetch( `${API_URL}/users`,
          {
            method: "GET",
            headers: {
              //Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setCustomers(data.users || []);
      } catch (error) {
        console.error("Fetch customers error:", error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  //GET PRODUCTS FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await fetch(`${API_URL}/products`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products);
      } catch (error) {
        console.error("Fetch products error:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    sessionStorage.setItem("adminActiveTab", tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    console.log("navigating to admin")
    navigate("/admin");
  };

  const handleItemsInfo = (order) => {
    setSelectedOrder(order);
    setShowItemsModal(true);
  };

  const handleDeliveryInfo = (order) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
  };

  const handleOrderStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status"
        );
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId
            ? data.order
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      alert(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${`${API_URL}/products`}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );

      sessionStorage.setItem("adminActiveTab", activeTab);
      window.location.reload();
    } catch (error) {
      console.error("Delete product error:", error);
      alert(error.message);
    }
  };  

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        console.error("Admin token not found");
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/admin`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper Function: Upload Image File to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    // Fallback if Cloudinary settings are default / missing
    if (CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
      console.warn("Cloudinary not configured. Returning local object URL for demo.");
      return URL.createObjectURL(file);
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return URL.createObjectURL(file); // Fallback to local URL on error
    }
  };

  // Handle Add Image File Change
  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProdFile(file);
      setNewProdPreview(URL.createObjectURL(file));
    }
  };

  // ADD PRODUCT SUBMIT
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProd.name || !newProd.price || !newProdFile || !newProd.category) {
      alert("Name, price and image are required");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();

      formData.append("name", newProd.name);
      formData.append("price", newProd.price || "");
      formData.append("oldPrice", newProd.oldPrice || "");
      formData.append("stock", newProd.stock || "0");
      formData.append("rating", newProd.rating || "0");
      formData.append("category", newProd.category || "");
      formData.append("badge", newProd.badge || "");
      formData.append("description", newProd.description || "");
      formData.append("image", newProdFile);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setProducts((prev) => [data.product, ...prev]);

      setNewProd({
        name: "",
        price: "",
        oldPrice: "",
        stock: "",
        rating: "",
        category: "",
        badge: "",
        description: "",
      });

      setNewProdFile(null);
      setNewProdPreview("");

      setShowAddModal(false);
      window.location.reload();

    } catch (error) {
      console.error("Add product error:", error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProd({ ...product });
    setEditProdPreview(product.image);
    setEditProdFile(null);
    setShowEditModal(true);
  };

  // Handle Edit Image File Change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProdFile(file);
      setEditProdPreview(URL.createObjectURL(file));
    }
  };

  // UPDATE PRODUCT SUBMIT
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!editingProd.name || !editingProd.price || !editingProd.category) {
      alert("Name, price and category are required");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();

      formData.append("name", editingProd.name);
      formData.append("price", editingProd.price);
      formData.append("category", editingProd.category);

      formData.append(
        "oldPrice",
        editingProd.oldPrice !== null && editingProd.oldPrice !== undefined
          ? editingProd.oldPrice
          : ""
      );

      formData.append(
        "stock",
        editingProd.stock !== null && editingProd.stock !== undefined
          ? editingProd.stock
          : "0"
      );

      formData.append(
        "rating",
        editingProd.rating !== null && editingProd.rating !== undefined
          ? editingProd.rating
          : "0"
      );
      
      formData.append(
        "badge",
        editingProd.badge || ""
      );

      formData.append(
        "description",
        editingProd.description || ""
      );

      if (editProdFile) {
        formData.append("image", editProdFile);
      }

      const response = await fetch(
        `${`${API_URL}/products`}/${editingProd.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product"
        );
      }

      setProducts((prev) =>
        prev.map((product) =>
          product.id === data.product.id
            ? data.product
            : product
        )
      );

      setShowEditModal(false);
      setEditingProd(null);
      setEditProdFile(null);
      setEditProdPreview("");
      window.location.reload();

    } catch (error) {
      console.error("Update product error:", error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const totalRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    )
    .toFixed(2);

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0
  );

  const validOrders = orders.filter(
    (order) => order.status !== "Cancelled"
  );

  const total = validOrders
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    )
    .toFixed(2);

  const now = new Date();

  const monthlySales = validOrders
    .filter((order) => {
      const date = new Date(order.createdAt);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );

  const weeklySales = validOrders
    .filter((order) => {
      const date = new Date(order.createdAt);

      const diff =
        (now - date) /
        (1000 * 60 * 60 * 24);

      return diff >= 0 && diff <= 7;
    })
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );

  const yearlySales = validOrders
    .filter((order) => {
      const date = new Date(order.createdAt);

      return date.getFullYear() === now.getFullYear();
    })
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );

  const topSellingProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const bestProduct = topSellingProducts[0];

  // ---------- WEEKLY ----------
  const weekData = Array(7).fill(0);

  validOrders.forEach((order) => {
    const orderDate = new Date(order.createdAt);

    const diff =
      (now - orderDate) /
      (1000 * 60 * 60 * 24);

    if (diff >= 0 && diff <= 7) {
      weekData[orderDate.getDay()] +=
        Number(order.total || 0);
    }
  });

  const monthData = Array(12).fill(0);

  validOrders.forEach((order) => {
    const orderDate = new Date(order.createdAt);

    if (
      orderDate.getFullYear() ===
      now.getFullYear()
    ) {
      monthData[orderDate.getMonth()] +=
        Number(order.total || 0);
    }
  });

  const yearData = {};

  validOrders.forEach((order) => {
    const year = new Date(
      order.createdAt
    ).getFullYear();

    yearData[year] =
      (yearData[year] || 0) +
      Number(order.total || 0);
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800 font-sans p-2 md:p-4">
      {/* 1. MOBILE TOP BAR */}
      <div className="md:hidden bg-gray-900 text-white flex items-center justify-between p-4 sticky top-0 z-30 shadow-md">
        <div className="text-base font-bold flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-mono">A</span>
          Admin Panel
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 2. BACKDROP OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* 3. SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col p-4 shrink-0 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="hidden md:flex text-lg font-bold p-2 items-center gap-2 border-b border-gray-800 pb-4 mb-4">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-mono">A</span>
          Admin Panel
        </div>

        <nav className="flex flex-col gap-1 flex-1 mt-4 md:mt-0">
          <SidebarBtn label="Dashboard" active={activeTab === "dashboard"} onClick={() => handleTabChange("dashboard")} icon="📊" />
          <SidebarBtn label="Orders" active={activeTab === "orders"} onClick={() => handleTabChange("orders")} badge={orders.length} icon="📦" />
          <SidebarBtn label="Products" active={activeTab === "products"} onClick={() => handleTabChange("products")} badge={products.length} icon="🏷️" />
          <SidebarBtn label="Customers" active={activeTab === "customers"} onClick={() => handleTabChange("customers")} badge={customers.length} icon="👥" />
          <SidebarBtn label="Sales" active={activeTab === "sales"} onClick={() => handleTabChange("sales")} icon="📈" />
        </nav>

        <div className="pt-4 border-t border-gray-800">
          <a onClick={handleLogout} href="/" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            ← Logout
          </a>
        </div>
      </aside>
        
      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">{activeTab}</h1>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <a href="/" className="text-sm font-semibold text-gray-900 leading-tight">Back to Home</a>
            </div>
            <a href="/" className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
              Home
            </a>
          </div>
        </header>

        {/* 1. DASHBOARD VIEW */}
        {/* 1. DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Total Revenue" value={`${totalRevenue}₹`} trend="+14% this month" color="border-emerald-500" />
              <StatCard title="Total Orders" value={orders.length} trend="+5 new today" color="border-blue-500" />
              <StatCard title="Total Products" value={products.length} trend={`Check product page for more`} color="border-amber-500" />
              <StatCard title="Total Customers" value={customers.length} trend="+2 new this week" color="border-purple-500" />
              <StatCard title="Total Stock" value={totalStock} trend="Available inventory" color="border-orange-500"/>
             </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
              <OrdersTable orders={orders.slice(0, 3)} loading={loadingOrders} onStatusChange={handleOrderStatusChange} onDeliveryInfo={handleDeliveryInfo} onItemsInfo={handleItemsInfo} />
            </div>
          </div>
        )}

        {/* 2. ORDERS VIEW */}
        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">All Store Orders</h3>
            </div>
            <OrdersTable orders={orders} onStatusChange={handleOrderStatusChange} loading={loadingOrders} onDeliveryInfo={handleDeliveryInfo} onItemsInfo={handleItemsInfo}/>
          </div>
        )}

        {/* 3. PRODUCTS VIEW */}
        {activeTab === "products" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Product Catalog</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <span>+</span> Add New Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Old Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingProducts ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                          <p className="mt-3 text-sm text-gray-500">
                            Loading products...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-600">{p.name}</td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-600">₹{p.price.toFixed(0)}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-900">₹{p.oldPrice.toFixed(0)}</td>
                      <td className="py-3.5 px-4 text-sm">
                        <span
                          className={`font-semibold ${
                            p.stock <= 0
                              ? "text-red-500"
                              : p.stock <= 5
                              ? "text-amber-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {p.stock ?? 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm">{p.category}</td>
                      <td className="py-3.5 px-4 text-sm">
                        <span className={`font-semibold ${p.rating < 3.5 ? "text-red-500" : "text-emerald-600"} `}>
                          {p.rating}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-xs px-3 py-1.5 rounded-md transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs px-3 py-1.5 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>

            {/* ADD PRODUCT MODAL */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Add New Clothing Product</h3>
                  <form onSubmit={handleAddProduct} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                      <input
                        type="text"
                        placeholder="Name of the product"
                        value={newProd.name}
                        onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* FILE INPUT FOR IMAGE */}
                    

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">New Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="New Price"
                        value={newProd.price}
                        onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Old Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Old Price"
                        value={newProd.oldPrice}
                        onChange={(e) => setNewProd({ ...newProd, oldPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Stock Quantity
                      </label>

                      <input
                        type="number"
                        min="0"
                        placeholder="Available stock"
                        value={newProd.stock}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            stock: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Badge</label>
                      <input
                        type="text"
                        placeholder="Any Speciality"
                        value={newProd.badge}
                        onChange={(e) => setNewProd({ ...newProd, badge: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                      <input
                        type="text"
                        placeholder="Any Speciality"
                        value={newProd.description}
                        onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Upload Product Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNewImageChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                          required
                        />
                        {newProdPreview && (
                          <div className="mt-3 flex items-center gap-3">
                            <img src={newProdPreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                            <span className="text-xs text-gray-500">Image selected</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Category
                        </label>

                        <select
                          value={newProd.category}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              category: e.target.value,
                            })
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                    text-sm bg-white
                                    focus:ring-2 focus:ring-blue-500
                                    focus:outline-none"
                        >
                          <option value="">Select Category</option>

                          {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Rating(Limit 5)</label>
                        <input
                          type="number"
                          placeholder="Rating"
                          value={newProd.rating}
                          onChange={(e) => setNewProd({ ...newProd, rating: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        disabled={isUploading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isUploading ? "Uploading..." : "Save Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* EDIT PRODUCT MODAL */}
            {showEditModal && editingProd && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Edit Product</h3>
                  <form onSubmit={handleUpdateProduct} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                      <input
                        type="text"
                        value={editingProd.name}
                        onChange={(e) => setEditingProd({ ...editingProd, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* EDIT FILE INPUT */}
                    

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Price</label>
                      <input
                        type="number"
                        value={editingProd.price}
                        onChange={(e) => setEditingProd({ ...editingProd, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Old Price</label>
                      <input
                        type="number"
                        value={editingProd.oldPrice}
                        onChange={(e) => setEditingProd({ ...editingProd, oldPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Stock Quantity
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={editingProd.stock ?? 0}
                        onChange={(e) =>
                          setEditingProd({
                            ...editingProd,
                            stock: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Category
                      </label>

                      <select
                        value={editingProd.category || ""}
                        onChange={(e) =>
                          setEditingProd({
                            ...editingProd,
                            category: e.target.value,
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                  text-sm bg-white
                                  focus:ring-2 focus:ring-blue-500
                                  focus:outline-none"
                      >
                        <option value="">Select Category</option>

                        {PRODUCT_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Badge</label>
                      <input
                        type="text"
                        value={editingProd.badge}
                        onChange={(e) => setEditingProd({ ...editingProd, badge: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                      <input
                        type="text"
                        value={editingProd.description}
                        onChange={(e) => setEditingProd({ ...editingProd, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Change Photo (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {editProdPreview && (
                          <div className="mt-3 flex items-center gap-3">
                            <img src={editProdPreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                            <span className="text-xs text-gray-500">Current / New Preview</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
                        <input
                          type="number"
                          value={editingProd.rating}
                          onChange={(e) => setEditingProd({ ...editingProd, rating: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingProd(null);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        disabled={isUploading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isUploading ? "Uploading..." : "Update Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. CUSTOMERS VIEW */}
        {activeTab === "customers" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Registered Customers
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {customers.length} registered customers
              </p>
            </div>
          </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          {loadingCustomers ? (
            <div className="p-8 text-center text-gray-500">
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No customers registered yet.
            </div>
          ) : (
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Joined</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr
                key={customer._id}
                className="hover:bg-gray-50/50 transition-colors text-sm text-gray-700"
              >
                <td className="py-3.5 px-4 font-semibold text-gray-900">
                  {customer.name}
                </td>

                <td className="py-3.5 px-4">
                  {customer.phone}
                </td>

                <td className="py-3.5 px-4">
                  {customer.location}
                </td>

                <td className="py-3.5 px-4">
                  {customer.email || "Not provided"}
                </td>

                <td className="py-3.5 px-4 text-gray-500">
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)}

        {/* 5. SALES VIEW */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard onClick={() => setSalesView("monthly")} title="Monthly Sales" value={`₹${monthlySales.toLocaleString()}`} trend="+12%" color="border-blue-500" />
              <StatCard onClick={() => setSalesView("weekly")} title="Weekly Sales" value={`₹${weeklySales.toLocaleString()}`} trend="+8%" color="border-blue-500" />
              <StatCard onClick={() => setSalesView("yearly")} title="Yearly Sales" value={`₹${yearlySales.toLocaleString()}`} trend="+24%" color="border-blue-500" />
            </div>

            <div className="flex gap-3 justify-center mb-4">
              <button
                onClick={() => setSalesView("weekly")}
                className={salesView === "weekly" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
              >
                Weekly
              </button>
              <button
                onClick={() => setSalesView("monthly")}
                className={salesView === "monthly" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
              >
                Monthly
              </button>
              <button
                onClick={() => setSalesView("yearly")}
                className={salesView === "yearly" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
              >
                Yearly
              </button>
            </div>

            {salesView === "weekly" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Last 7 Days Revenue</h2>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                  <div key={day} className="flex justify-between border-b py-2">
                    <span>{day}</span>
                    <span>₹{weekData[index]}</span>
                  </div>
                ))}
              </div>
            )}

            {salesView === "monthly" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
                  <div key={month} className="flex justify-between border-b py-2">
                    <span>{month}</span>
                    <span>₹{monthData[index]}</span>
                  </div>
                ))}
              </div>
            )}

            {salesView === "yearly" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Yearly Revenue</h2>
                {Object.entries(yearData).map(([year, total]) => (
                  <div key={year} className="flex justify-between border-b py-2">
                    <span>{year}</span>
                    <span>₹{total}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
              {topSellingProducts.map((item, index) => (
                <div key={item.id} className="flex justify-between py-3 border-b">
                  <span>{index + 1}. {item.name}</span>
                  <span className="font-bold">{item.sales} Sold</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-700">Best Selling Product</h2>
              <p className="mt-3 text-lg font-semibold">{bestProduct?.name}</p>
              <p className="text-gray-600">{bestProduct?.sales} Units Sold</p>
            </div>
          </div>
        )}

        {showDeliveryModal && selectedOrder && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeliveryModal(false)}
          >
            <div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Delivery Address
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Order #{selectedOrder.orderId}
                  </p>
                </div>

                <button
                  onClick={() => setShowDeliveryModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Customer
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedOrder.customer?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </p>

                  <p className="mt-1 text-gray-700">
                    {selectedOrder.customer?.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Address
                  </p>

                  <p className="mt-1 text-gray-700 leading-6">
                    {selectedOrder.customer?.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      City
                    </p>

                    <p className="mt-1 text-gray-700">
                      {selectedOrder.customer?.city}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      State
                    </p>

                    <p className="mt-1 text-gray-700">
                      {selectedOrder.customer?.state}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Pincode
                  </p>

                  <p className="mt-1 text-gray-700">
                    {selectedOrder.customer?.pincode}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDeliveryModal(false)}
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {showItemsModal && selectedOrder && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowItemsModal(false)}
          >
            <div
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Ordered Products
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Order #{selectedOrder.orderId}
                  </p>
                </div>

                <button
                  onClick={() => setShowItemsModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg"
                >
                  ×
                </button>
              </div>

              {/* ITEMS */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {selectedOrder.items?.length ? (
                  selectedOrder.items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                          />
                        )}

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            ₹
                            {Number(
                              item.price || 0
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500">
                          Quantity
                        </p>

                        <p className="font-bold text-gray-900">
                          × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No products found.
                  </p>
                )}
              </div>

              {/* TOTAL */}
              <div className="border-t border-gray-200 mt-5 pt-4 flex justify-between">
                <span className="font-semibold text-gray-700">
                  Order Total
                </span>

                <span className="font-bold text-gray-900">
                  ₹
                  {Number(
                    selectedOrder.total || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() => setShowItemsModal(false)}
                className="w-full mt-5 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function SidebarBtn({ label, active, onClick, badge, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
        active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
      }`}
    >
      <span className="flex items-center gap-2">
        <span>{icon}</span> {label}
      </span>
      {badge !== undefined && (
        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full font-mono">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ title, value, trend, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm border-t-4 ${color} ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 my-2">{value}</h2>
      <p className="text-xs font-medium text-emerald-600">{trend}</p>
    </div>
  );
}

function OrdersTable({ orders, loading, onStatusChange, onDeliveryInfo, onItemsInfo,}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
            <th className="py-3 px-4">
              Order ID
            </th>

            <th className="py-3 px-4">
              Customer
            </th>

            <th className="py-3 px-4">
              Date
            </th>

            <th className="py-3 px-4">
              Items
            </th>

            <th className="py-3 px-4">
              Payment
            </th>

            <th className="py-3 px-4">
              Total
            </th>

            <th className="py-3 px-4">
              Status
            </th>

            <th className="py-3 px-4 text-center">
              Delivery
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan="8" className="py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>

                  <p className="mt-3 text-sm text-gray-500">
                    Loading orders...
                  </p>
                </div>
              </td>
            </tr>
          ) :
          orders.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="py-10 text-center text-gray-500"
              >
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.orderId}
                className="hover:bg-gray-50/50 transition-colors text-sm text-gray-700"
              >
                {/* ORDER ID */}
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  {order.orderId}
                </td>

                {/* CUSTOMER */}
                <td className="py-3.5 px-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.customer?.name ||
                        "Unknown"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {order.customer?.email ||
                        ""}
                    </p>
                  </div>
                </td>

                {/* DATE */}
                <td className="py-3.5 px-4 text-gray-500">
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </td>

                {/* ITEMS */}
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onItemsInfo(order)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                    title="View ordered products"
                  >
                    {order.items?.reduce(
                      (total, item) =>
                        total + Number(item.quantity || 1),
                      0
                    ) || 0}
                  </button>
                </td>

                {/* PAYMENT */}
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      order.payment === "online"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.payment === "online"
                      ? "Online"
                      : "COD"}
                  </span>
                </td>

                {/* TOTAL */}
                <td className="py-3.5 px-4 font-semibold text-gray-900">
                  ₹
                  {Number(
                    order.total || 0
                  ).toLocaleString("en-IN")}
                </td>

                {/* STATUS */}
                <td className="py-3.5 px-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      onStatusChange(
                        order.orderId,
                        e.target.value
                      )
                    }
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : order.status === "Shipped"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : order.status === "Processing"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : order.status === "Cancelled"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-gray-50 text-gray-700 border-gray-300"
                    }`}
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => onDeliveryInfo(order)}
                    title="View delivery address"
                    className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold border border-blue-200 transition-colors"
                  >
                    i
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}