const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    // const createProduct = new Product({
    //   Title: req.body.title,
    //   Price: req.body.price,
    //   Description: req.body.description,
    // });
    // const productData = await createProduct.save();
    const productData = await Product.insertMany([
      {
        Title: "iphone 5",
        Price: 5000,
        Description: "iphone 5 is a Nice Phone",
      },
      {
        Title: "iphone 6",
        Price: 6000,
        Description: "iphone 6 is a Nice Phone",
      },
      {
        Title: "iphone 7",
        Price: 7000,
        Description: "iphone 7 is a Nice Phone",
      },
    ]);
    res.status(201).send({
      productData,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Something is wrong",
      message: error.message,
    });
  }
});

//! READ Product
app.get("/productRoute/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const productData = await Product.findOne({ _id: id }).select({
    //   Title: 1,
    //   Description: 1,
    //   _id: 0,
    // });
    const productData = await Product.findOne(
      { _id: id },
      { Title: 1, Price: 1, _id: 0 }
    );
    if (productData) {
      res.status(200).send({ productData });
    } else {
      res.status(404).send({
        message: "Product Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
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
