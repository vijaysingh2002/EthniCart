const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Generic email function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"EthniCart" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);

    return true;
  } catch (error) {
    console.error("Email sending error:", error);

    return false;
  }
};


// ======================================================
// NEW ORDER → USER
// ======================================================

const sendNewOrderUserEmail = async (order) => {
  return sendEmail({
    to: order.customer.email,

    subject: `Order Placed Successfully - ${order.orderId}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2 style="text-align:center;">
          EthniCart
        </h2>

        <h3>
          Order Placed Successfully 🎉
        </h3>

        <p>
          Hello <strong>${order.customer.name}</strong>,
        </p>

        <p>
          Thank you for shopping with EthniCart.
          Your order has been successfully placed.
        </p>

        <hr>

        <p>
          <strong>Order ID:</strong>
          ${order.orderId}
        </p>

        <p>
          <strong>Status:</strong>
          ${order.status}
        </p>

        <p>
          <strong>Payment:</strong>
          ${order.payment}
        </p>

        <p>
          <strong>Total:</strong>
          ₹${order.total}
        </p>

        <h3>Order Items</h3>

        <ul>
          ${order.items
            .map(
              (item) => `
                <li style="margin-bottom: 8px;">
                  <strong>${item.name}</strong>
                  × ${item.quantity}
                  — ₹${item.price}
                </li>
              `
            )
            .join("")}
        </ul>

        <hr>

        <p>
          We will notify you whenever your order status changes.
        </p>

        <p>
          Thank you for choosing <strong>EthniCart</strong> ❤️
        </p>

      </div>
    `,
  });
};


// ======================================================
// NEW ORDER → ADMIN
// ======================================================

const sendNewOrderAdminEmail = async (order) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    
    subject: `New Order Received - ${order.orderId}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
      ">

        <h2>EthniCart - New Order 🛒</h2>

        <hr>

        <h3>Order Details</h3>

        <p>
          <strong>Order ID:</strong>
          ${order.orderId}
        </p>

        <p>
          <strong>Status:</strong>
          ${order.status}
        </p>

        <p>
          <strong>Payment:</strong>
          ${order.payment}
        </p>

        <p>
          <strong>Total:</strong>
          ₹${order.total}
        </p>

        <h3>Customer Details</h3>

        <p>
          <strong>Name:</strong>
          ${order.customer.name}
        </p>

        <p>
          <strong>Email:</strong>
          ${order.customer.email}
        </p>

        <p>
          <strong>Phone:</strong>
          ${order.customer.phone}
        </p>

        <p>
          <strong>Address:</strong><br>
          ${order.customer.address},<br>
          ${order.customer.city},<br>
          ${order.customer.state} - ${order.customer.pincode}
        </p>

        <h3>Items</h3>

        <ul>
          ${order.items
            .map(
              (item) => `
                <li style="margin-bottom: 8px;">
                  <strong>${item.name}</strong>
                  × ${item.quantity}
                  — ₹${item.price}
                </li>
              `
            )
            .join("")}
        </ul>

      </div>
    `,
  });
};


// ======================================================
// ORDER STATUS UPDATE → USER ONLY
// ======================================================

const sendOrderStatusEmail = async (order, oldStatus) => {
  return sendEmail({
    to: order.customer.email,

    subject: `Order ${order.orderId} - ${order.status}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2>EthniCart</h2>

        <h3>
          Order Status Updated 🔄
        </h3>

        <p>
          Hello <strong>${order.customer.name}</strong>,
        </p>

        <p>
          Your order status has been updated.
        </p>

        <hr>

        <p>
          <strong>Order ID:</strong>
          ${order.orderId}
        </p>

        <p>
          <strong>Previous Status:</strong>
          ${oldStatus}
        </p>

        <p>
          <strong>Current Status:</strong>
          ${order.status}
        </p>

        <p>
          <strong>Total:</strong>
          ₹${order.total}
        </p>

        <hr>

        <p>
          We will continue to keep you updated about your order.
        </p>

        <p>
          Thank you for shopping with <strong>EthniCart</strong> ❤️
        </p>

      </div>
    `,
  });
};


// ======================================================
// ORDER CANCELLED → USER
// ======================================================

const sendOrderCancelledUserEmail = async (order) => {
  return sendEmail({
    to: order.customer.email,

    subject: `Order Cancelled - ${order.orderId}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2>EthniCart</h2>

        <h3>
          Order Cancelled ❌
        </h3>

        <p>
          Hello <strong>${order.customer.name}</strong>,
        </p>

        <p>
          Your order has been cancelled successfully.
        </p>

        <hr>

        <p>
          <strong>Order ID:</strong>
          ${order.orderId}
        </p>

        <p>
          <strong>Total:</strong>
          ₹${order.total}
        </p>

        <p>
          <strong>Status:</strong>
          ${order.status}
        </p>

        <hr>

        <p>
          If you have any questions, please contact our support team.
        </p>

        <p>
          Thank you for choosing EthniCart.
        </p>

      </div>
    `,
  });
};


// ======================================================
// ORDER CANCELLED → ADMIN
// ======================================================

const sendOrderCancelledAdminEmail = async (order) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,

    subject: `Order Cancelled - ${order.orderId}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
      ">

        <h2>EthniCart - Order Cancelled ❌</h2>

        <hr>

        <h3>Order Details</h3>

        <p>
          <strong>Order ID:</strong>
          ${order.orderId}
        </p>

        <p>
          <strong>Total:</strong>
          ₹${order.total}
        </p>

        <p>
          <strong>Status:</strong>
          ${order.status}
        </p>

        <h3>Customer Details</h3>

        <p>
          <strong>Name:</strong>
          ${order.customer.name}
        </p>

        <p>
          <strong>Email:</strong>
          ${order.customer.email}
        </p>

        <p>
          <strong>Phone:</strong>
          ${order.customer.phone}
        </p>

        <p>
          <strong>Address:</strong><br>
          ${order.customer.address},<br>
          ${order.customer.city},<br>
          ${order.customer.state} - ${order.customer.pincode}
        </p>

      </div>
    `,
  });
};


module.exports = {
  sendNewOrderUserEmail,
  sendNewOrderAdminEmail,
  sendOrderStatusEmail,
  sendOrderCancelledUserEmail,
  sendOrderCancelledAdminEmail,
};