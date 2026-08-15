const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      oldPrice,
      stock,
      rating,
      category,
      badge,
      description,
    } = req.body;

    if (!name || !price || !category || !req.file || stock == undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, pric, stock and image are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      oldPrice,
      stock,
      rating,
      category,
      badge,
      description,
      image: req.file.path,
      cloudinaryPublicId: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        stock: product.stock,
        rating: product.rating,
        image: product.image,
        badge: product.badge,
        description: product.description,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      stock: product.stock,
      rating: product.rating,
      image: product.image,
      badge: product.badge,
      description: product.description,
    }));

    res.json({
      success: true,
      count: products.length,
      products: formattedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get products",
    });
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product : {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        stock: product.stock,
        rating: product.rating,
        image: product.image,
        badge: product.badge,
        description: product.description,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

// EDIT PRODUCT
const editProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      price,
      oldPrice,
      stock,
      rating,
      category,
      badge,
      description,
    } = req.body;

    if (name != undefined) product.name = name;
    if (price != undefined) product.price = price;
    if (oldPrice != undefined) product.oldPrice = oldPrice;
    if (stock != undefined) product.stock = stock;
    if (rating != undefined) product.rating = rating;
    if (category != undefined) product.category = category;
    if (badge != undefined) product.badge = badge;
    if (description != undefined) product.description = description;

    // If a new image is uploaded
    if (req.file) {

      // Delete old image
      if (product.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(
          product.cloudinaryPublicId
        );
      }

      product.image = req.file.path;
      product.cloudinaryPublicId = req.file.filename;
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product : {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        stock: product.stock,
        rating: product.rating,
        image: product.image,
        badge: product.badge,
        description: product.description,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(
        product.cloudinaryPublicId
      );
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};


module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProductById,
};