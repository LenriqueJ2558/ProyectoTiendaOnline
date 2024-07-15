const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discount.controller');

// Rutas CRUD para cupones de descuento
router.post('/discounts', discountController.createDiscount);
router.get('/discounts', discountController.getAllDiscounts);
router.get('/discounts/:id', discountController.getDiscountById);
router.put('/discounts/:id', discountController.updateDiscount);
router.delete('/discounts/:id', discountController.deleteDiscount);

module.exports = router;