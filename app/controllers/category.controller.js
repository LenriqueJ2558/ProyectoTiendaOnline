const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body; // Obtener el nombre de la categoría desde el cuerpo de la solicitud

    // Crear una nueva instancia del modelo Category
    const newCategory = new Category({ name });

    // Guardar la nueva categoría en la base de datos
    const savedCategory = await newCategory.save();

    // Responder con la categoría creada en formato JSON
    res.status(201).json(savedCategory);
  } catch (error) {
    // Manejar errores durante la creación de la categoría
    res.status(400).json({ message: error.message });
  }
};
exports.getAllCategories = async (req, res) => {
    try {
      // Obtener todas las categorías desde la base de datos
      const categories = await Category.find();
  
      // Responder con las categorías encontradas en formato JSON
      res.status(200).json(categories);
    } catch (error) {
      // Manejar errores durante la obtención de las categorías
      res.status(500).json({ message: error.message });
    }
  };
  exports.getCategoryById = async (req, res) => {
    const categoryId = req.params.id; // Obtener el ID de la categoría desde los parámetros de la URL
  
    try {
      // Buscar la categoría por su ID en la base de datos
      const category = await Category.findById(categoryId);
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Responder con la categoría encontrada en formato JSON
      res.status(200).json(category);
    } catch (error) {
      // Manejar errores durante la búsqueda de la categoría
      res.status(500).json({ message: error.message });
    }
  };
  exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id; // Obtener el ID de la categoría desde los parámetros de la URL
  
    try {
      // Verificar si la categoría existe en la base de datos
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Actualizar la categoría con los datos del cuerpo de la solicitud (req.body)
      Object.assign(existingCategory, req.body);
  
      // Guardar la categoría actualizada en la base de datos
      const updatedCategory = await existingCategory.save();
  
      // Responder con la categoría actualizada en formato JSON
      res.status(200).json(updatedCategory);
    } catch (error) {
      // Manejar errores durante la actualización de la categoría
      res.status(400).json({ message: error.message });
    }
  };
  exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id; // Obtener el ID de la categoría desde los parámetros de la URL
  
    try {
      // Verificar si la categoría existe en la base de datos
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Eliminar la categoría de la base de datos
      await existingCategory.remove();
  
      // Responder con un mensaje de éxito
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      // Manejar errores durante la eliminación de la categoría
      res.status(500).json({ message: error.message });
    }
  };
  