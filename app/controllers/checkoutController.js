const Order = require('../models/OrdenCompra.model');
const Product = require('../models/product.model');


const checkout = async (req, res) => {
    try {
      const userId = req.user._id;
      const { cartItems } = req.body;
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío' });
      }

      let total = 0;
      const orderProducts = [];
  
      for (const item of cartItems) {
        const product = await Product.findById(item.productId).populate('discount');
        if (!product) {
          return res.status(404).json({ message: 'Producto no encontrado' });
        }
  
        let finalPrice = product.precio;
  
        if (product.discount) {
          if (product.discount.discountType === 'percentage') {
            finalPrice *= (1 - product.discount.amount / 100);
          } else if (product.discount.discountType === 'fixed') {
            finalPrice -= product.discount.amount;
            if (finalPrice < 0) finalPrice = 0;
          }
        }
  
        orderProducts.push({
          product: product._id,
          quantity: item.quantity
        });
  
        total += finalPrice * item.quantity;
      }
      let order = await Order.findOne({ user: userId, status: 'pending' });

      if (order) {
        // Actualizar productos y total de la orden existente
        order.products = orderProducts;
        order.total = total;
      } else {
        // Crear una nueva orden de compra
        order = new Order({
          user: userId,
          products: orderProducts,
          total,
          status: 'pending'
        });
      }
  
      await order.save();
  
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al procesar el pedido' });
    }
  };

const getPendingOrders = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const pendingOrders = await Order.find({ user: userId, status: 'pending' }).populate('products.product');
  
      if (!pendingOrders.length) {
        return res.status(404).json({ message: 'No hay pedidos pendientes' });
      }
  
      res.status(200).json(pendingOrders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los pedidos pendientes' });
    }
  };
  
  module.exports = { checkout , getPendingOrders};