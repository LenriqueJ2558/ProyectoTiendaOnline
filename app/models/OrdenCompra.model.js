const mongoose = require("mongoose");

const OrdenCompra = mongoose.model(
    "OrdenCompra",
   new mongoose.Schema({
    
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User', 
          required: true },
    products: [{
        product: { 
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Product', 
            required: true },
    quantity: { 
           type: Number, 
          required: true }
  }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
}));

    module.exports = OrdenCompra;