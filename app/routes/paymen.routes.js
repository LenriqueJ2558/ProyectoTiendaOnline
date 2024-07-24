const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authJwt } = require("../middlewares");

router.post('/pay',paymentController.payOrder);
router.get('/cart', [authJwt.verifyToken], paymentController.getCartItems);
router.patch('/confirm-order' ,[authJwt.verifyToken], paymentController.confirmOrder);
router.get('/my-orders', [authJwt.verifyToken], paymentController.getMyOrders);

module.exports = router;