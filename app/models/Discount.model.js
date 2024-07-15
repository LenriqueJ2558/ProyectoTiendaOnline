const mongoose = require("mongoose");

const Discount = mongoose.model(
    "Discount",
   new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
        required: true
      },
      discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      usageLimit: {
        type: Number,
        default: 1
      },
      products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }],
      categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }]
    }))
    

    module.exports = Discount;