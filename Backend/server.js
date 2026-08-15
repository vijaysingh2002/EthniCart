const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes.js");

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ecommerce API is running",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

const cloudinary = require("./config/cloudinary");

app.get("/test-cloudinary-upload", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "./AjayPro.webp",
      {
        folder: "ethniCart/products",
        resource_type: "image"
      }
    );

    console.log("UPLOAD SUCCESS:", result);

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error("🔥 CLOUDINARY UPLOAD ERROR");
    console.error(error);
    console.error("MESSAGE:", error.message);
    console.error("HTTP CODE:", error.http_code);

    res.status(500).json({
      success: false,
      message: error.message,
      http_code: error.http_code
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});