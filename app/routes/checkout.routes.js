const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { authJwt } = require("../middlewares");

router.post('/checkout', [authJwt.verifyToken], checkoutController.checkout);
router.get('/orders/pending',[authJwt.verifyToken], checkoutController.getPendingOrders)
module.exports = router;