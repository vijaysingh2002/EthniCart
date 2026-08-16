const express = require("express");

const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminProtect");

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/user/:userId", protect, getUserOrders);
router.get("/admin", getAllOrders);
router.get("/:id", protect, getOrderById);

router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

router.put("/:id/status", adminProtect, updateOrderStatus);

module.exports = router;