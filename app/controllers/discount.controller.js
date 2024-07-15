const Discount = require('../models/Discount.model');

// Función para crear un nuevo cupón de descuento
exports.createDiscount = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      amount,
      startDate,
      endDate,
      usageLimit,
      products,
      categories
    } = req.body; // Obtener datos del cuerpo de la solicitud

    // Crear una nueva instancia del modelo Discount
    const newDiscount = new Discount({
      code,
      description,
      discountType,
      amount,
      startDate,
      endDate,
      usageLimit,
      products,
      categories
    });

    // Guardar el nuevo cupón de descuento en la base de datos
    const savedDiscount = await newDiscount.save();

    // Responder con el cupón de descuento creado en formato JSON
    res.status(201).json(savedDiscount);
  } catch (error) {
    // Manejar errores durante la creación del cupón de descuento
    res.status(400).json({ message: error.message });
  }
};

// Función para obtener todos los cupones de descuento
exports.getAllDiscounts = async (req, res) => {
  try {
    // Obtener todos los cupones de descuento desde la base de datos
    const discounts = await Discount.find();

    // Responder con los cupones de descuento encontrados en formato JSON
    res.status(200).json(discounts);
  } catch (error) {
    // Manejar errores durante la obtención de los cupones de descuento
    res.status(500).json({ message: error.message });
  }
};

// Función para obtener un cupón de descuento por su ID
exports.getDiscountById = async (req, res) => {
  const discountId = req.params.id; // Obtener el ID del cupón de descuento desde los parámetros de la URL

  try {
    // Buscar el cupón de descuento por su ID en la base de datos
    const discount = await Discount.findById(discountId);

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Responder con el cupón de descuento encontrado en formato JSON
    res.status(200).json(discount);
  } catch (error) {
    // Manejar errores durante la búsqueda del cupón de descuento
    res.status(500).json({ message: error.message });
  }
};

// Función para actualizar un cupón de descuento por su ID
exports.updateDiscount = async (req, res) => {
  const discountId = req.params.id; // Obtener el ID del cupón de descuento desde los parámetros de la URL

  try {
    // Verificar si el cupón de descuento existe en la base de datos
    const existingDiscount = await Discount.findById(discountId);
    if (!existingDiscount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Actualizar el cupón de descuento con los datos del cuerpo de la solicitud (req.body)
    Object.assign(existingDiscount, req.body);

    // Guardar el cupón de descuento actualizado en la base de datos
    const updatedDiscount = await existingDiscount.save();

    // Responder con el cupón de descuento actualizado en formato JSON
    res.status(200).json(updatedDiscount);
  } catch (error) {
    // Manejar errores durante la actualización del cupón de descuento
    res.status(400).json({ message: error.message });
  }
};

// Función para eliminar un cupón de descuento por su ID
exports.deleteDiscount = async (req, res) => {
  const discountId = req.params.id; // Obtener el ID del cupón de descuento desde los parámetros de la URL

  try {
    // Verificar si el cupón de descuento existe en la base de datos
    const existingDiscount = await Discount.findById(discountId);
    if (!existingDiscount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Eliminar el cupón de descuento de la base de datos
    await existingDiscount.remove();

    // Responder con un mensaje de éxito
    res.status(200).json({ message: 'Discount deleted successfully' });
  } catch (error) {
    // Manejar errores durante la eliminación del cupón de descuento
    res.status(500).json({ message: error.message });
  }
};