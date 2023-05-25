const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! ConnectDB
const connectionDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:/testDB");
    console.log("db is connected");
  } catch (error) {
    console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

//! Create Schema
const productDetails = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  cratedAt: {
    type: Date,
    default: Date.now,
  },
});

//! Model
const Product = mongoose.model("allProducts", productDetails);

//! CREATE Product
app.post("/productRoute", async (req, res) => {
  try {
    const createProduct = new Product({
      Title: req.body.title,
      Price: req.body.price,
      Description: req.body.description,
    });
    const productData = await createProduct.save();

    res.status(201).send({
      productData,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

//! Read all Product
app.get("/productRoute", async (req, res) => {
  try {
    const productData = await Product.find();
    res.status(200).send({
      success: true,
      data: productData,
      message: "These are the Products",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

//! READ Specific Product
app.get("/productRoute/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productData = await Product.findOne(
      { _id: id },
      { Title: 1, Price: 1, _id: 0 }
    );
    if (productData) {
      res.status(200).send({
        success: true,
        data: productData,
        message: "Find Sepcific Product by product's id",
      });
    } else {
      res.status(404).send({
        message: "Product Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

//! Delete Product.
app.delete("/productRoute/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productData = await Product.deleteOne({ _id: id });
    if (productData) {
      res.status(200).send({
        success: true,
        data: productData,
        message: "This Product is deleted",
      });
    } else {
      res.status(404).send({
        message: "Product Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

//! Server Section
const port = 3000;
app.listen(port, async () => {
  console.log(`server is running on port ${port}`);
  await connectionDB();
});
