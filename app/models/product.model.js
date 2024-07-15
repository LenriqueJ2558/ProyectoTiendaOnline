const mongoose = require("mongoose");

const Product = mongoose.model(
    "Product",
   new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      descripcion: {
        type: String,
        required: true
      },
      foto: {
        type: String,
        required: true
      },
      precio: {
        type: Number,
        required: true
      },
      stock: {
        type: Number,
        default: 0
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
      },
      discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount'
      }
    }));

    module.exports = Product;