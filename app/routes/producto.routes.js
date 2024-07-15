const express = require('express');
const router = express.Router();
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2

const productController  = require('../controllers/product.controller');

// Configurar Cloudinary
cloudinary.config({
    cloud_name: 'dzhjajneh',
    api_key: '667342425277889',
    api_secret: 'EeHSnBtUVsg7ZjyeL60u9Q83rU0'
  })
  
  // storage of cloudinary
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'uploads',
      allowed_formats: ['jpg', 'png']
    }
  })
  const parser = multer({ storage })

router.post('/products',parser.fields([{ name: 'image', maxCount: 1 }]), productController.createProduct);
router.get('/products',productController.productFilters, productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', parser.fields([{ name: 'image', maxCount: 1 }]),productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;