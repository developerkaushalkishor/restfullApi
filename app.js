const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// connecting to the database

mongoose
  .connect("mongodb://127.0.0.1:27017/Sample", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// creating product a schema

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

// creating product model

const Product = new mongoose.model("Product", productSchema);

// creating product

app.post("/api/v1/product/new", async (req, res) => {
  const cProduct = await Product.create(req.body);
  res.status(201).json({
    success: true,
    cProduct,
  });
});

// Read Product data

app.get("/api/v1/product", async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// Update Product data

app.put("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product data

app.delete("/api/v1/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  //   await product.remove();
  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    message: "Product is deleted successfully",
  });
});

// listening server

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
