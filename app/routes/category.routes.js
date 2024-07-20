const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authJwt } = require("../middlewares");
// Rutas CRUD para categorías
router.post('/categories',[authJwt.verifyToken, authJwt.isAdmin], categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id',[authJwt.verifyToken, authJwt.isAdmin], categoryController.updateCategory);
router.delete('/categories/:id',[authJwt.verifyToken, authJwt.isAdmin], categoryController.deleteCategory);

module.exports = router;
