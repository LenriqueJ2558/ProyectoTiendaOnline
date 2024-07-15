const Product = require('../models/product.model');
const cloudinary = require('cloudinary').v2;
exports.createProduct = async (req, res) => {
    try {
      // Extraer los datos del cuerpo de la solicitud
      const { name, descripcion, precio, stock, category, discount } = req.body;
  
      // Obtener la URL de la imagen subida desde Cloudinary
      const image = req.files['image'][0].path; // Esto depende de cómo se devuelve la URL de la imagen desde Cloudinary
  
      // Crear un nuevo producto con la URL de la imagen
      const newProduct = new Product({
        name,
        descripcion,
        foto: image, // Asignar la URL de la imagen al campo 'foto'
        precio,
        stock,
        category,
        discount
      });
  
      // Guardar el producto en la base de datos
      await newProduct.save();
  
      // Responder con el producto creado
      res.status(201).json(newProduct);
    } catch (error) {
      // Manejar errores durante la creación del producto
      res.status(400).json({ message: error.message });
    }
  };

  exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().populate('category').populate('discount');
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('category').populate('discount');
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.updateProduct = async (req, res) => {
    const productId = req.params.id; // Obtener el ID del producto desde los parámetros de la URL
  
    try {
      // Verificar si el producto existe en la base de datos
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Si hay una imagen nueva subida, actualizar la foto en Cloudinary
      if (req.files && req.files['image']) {
        const image = req.files['image'][0].path; // Obtener la ruta de la nueva imagen desde Cloudinary
        existingProduct.foto = image; // Actualizar el campo 'foto' en el documento del producto
      }
  
      // Actualizar otros campos del producto con los datos del cuerpo de la solicitud (req.body)
      Object.assign(existingProduct, req.body);
  
      // Guardar el producto actualizado en la base de datos
      const updatedProduct = await existingProduct.save();
  
      // Responder con el producto actualizado
      res.status(200).json(updatedProduct);
    } catch (error) {
      // Manejar errores durante la actualización del producto
      res.status(400).json({ message: error.message });
    }
  };
  exports.deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };