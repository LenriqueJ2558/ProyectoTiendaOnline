const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discount.controller');
const { authJwt } = require("../middlewares");
// Rutas CRUD para cupones de descuento
router.post('/discounts', [authJwt.verifyToken, authJwt.isAdmin],discountController.createDiscount);
router.get('/discounts', discountController.getAllDiscounts);
router.get('/discounts/:id', discountController.getDiscountById);
router.put('/discounts/:id',[authJwt.verifyToken, authJwt.isAdmin], discountController.updateDiscount);
router.delete('/discounts/:id',[authJwt.verifyToken, authJwt.isAdmin], discountController.deleteDiscount);

module.exports = router;