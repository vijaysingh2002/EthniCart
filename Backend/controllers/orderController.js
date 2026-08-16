const Order = require("../models/Order");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const {
  sendNewOrderUserEmail,
  sendNewOrderAdminEmail,
  sendOrderStatusEmail,
  sendOrderCancelledUserEmail,
  sendOrderCancelledAdminEmail,
} = require("../utils/sendOrderEmail");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      userId,
      customer,
      items,
      total,
      payment,
    } = req.body;

    
    if (
      !userId ||
      !customer ||
      !items?.length ||
      total === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required order details",
      });
    }

    session.startTransaction();

    for (const item of items) {
      const productId = item.id;
      const quantity = Number(item.quantity);

      if (!productId || !quantity || quantity <= 0) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: "Invalid product or quantity in order",
        });
      }

      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          stock: { $gte: quantity },
        },
        {
          $inc: {
            stock: -quantity,
          },
        },
        {
          returnDocument: "after",
          session,
        }
      );

      // Product doesn't exist OR insufficient stock
      if (!product) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${productId}`,
        });
      }
    }

    const order = await Order.create([{
      orderId: `EC${Date.now()}`,
      userId,
      customer,
      items,
      total,
      payment: payment || "cod",
      status: "Pending",
    }],{session});

    await session.commitTransaction();

    const createdOrder = order[0];

    // Send emails AFTER successful database transaction
    await Promise.allSettled([
      sendNewOrderUserEmail(createdOrder),
      sendNewOrderAdminEmail(createdOrder),
    ]);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }  finally {
      await session.endSession();
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const order = await Order.findOne({
      orderId: req.params.id,
    }).session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      ["Shipped", "Delivered", "Cancelled"].includes(
        order.status
      )
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled when status is ${order.status}`,
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.id, //item.product
        {
          $inc: {
            stock: Number(item.quantity),
          },
        },
        {
          session,
        }
      );
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    order.stockRestored = true;
    

    await order.save({ session });

    await session.commitTransaction();

    await Promise.allSettled([
      sendOrderCancelledUserEmail(order),
      sendOrderCancelledAdminEmail(order),
    ]);

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  } finally {
    await session.endSession();
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const session = await mongoose.startSession();

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    session.startTransaction();

    const order = await Order.findOne({
      orderId: id,
    }).session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldStatus = order.status;

    if (oldStatus === status) {
      await session.abortTransaction();

      return res.status(200).json({
        success: true,
        message: "Order status is already " + status,
        order,
      });
    }

    if (oldStatus === "Cancelled") {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "A cancelled order cannot be reactivated",
      });
    }

    if (status === "Cancelled") {
      // Restore stock only once
      if (!order.stockRestored) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.id,
            {
              $inc: {
                stock: Number(item.quantity),
              },
            },
            {
              session,
            }
          );
        }

        order.stockRestored = true;
      }

      order.cancelledAt = new Date();
    }

    if (status !== "Cancelled") {
      order.cancelledAt = null;
    } else {
      order.cancelledAt = new Date();
    }

    order.status = status;

    await order.save({ session });

    await session.commitTransaction();

    if (status !== "Cancelled") {
      await sendOrderStatusEmail(order, oldStatus);
    }

    // Cancellation → USER + ADMIN
    if (status === "Cancelled") {
      await Promise.allSettled([
        sendOrderCancelledUserEmail(order),
        sendOrderCancelledAdminEmail(order),
      ]);
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
    } finally {
      await session.endSession();
    }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};