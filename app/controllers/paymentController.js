const stripe = require("stripe")("sk_test_51PYHjy2KWHEWMpLQsYS971SbZqcKw040ioCecGPl4GC9907HFDsGXkhMQNjtJFNT2AYD0y6CAyOBFSqdrUpmo9yh00Oyf7ZOsX"); 

const Order  = require('../models/OrdenCompra.model');

const getCartItems = async (req, res) => {
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
const payOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Encuentra la orden e incluye los detalles del producto y el descuento
    const order = await Order.findById(orderId).populate({
      path: 'products.product',
      populate: { path: 'discount' }
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
     // Verifica si la orden está en estado 'pending'
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'La orden no está en estado pendiente' });
    }

    // Verifica que todos los datos del producto estén completos
    const orderProducts = order.products.map((item) => {
      const product = item.product;

      if (!product || !product.name || !product.precio) {
        throw new Error(`Datos del producto incompletos para el producto con ID: ${item.product}`);
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

      return {
        product: product,
        quantity: item.quantity,
        finalPrice: finalPrice
      };
    });

    // Crear una sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: orderProducts.map((item) => ({
        price_data: {
          currency: "pen",
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.finalPrice * 100,  // Utiliza el precio con descuento
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `http://localhost:3000/success?orderId=${order._id}`,
      cancel_url: "http://localhost:3000/cancel",
      metadata: { orderId: order._id.toString() }
    });

    res.status(201).json({ order, sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Verificar si el usuario está autenticado (ejemplo usando JWT)
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Encuentra y actualiza la orden
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'paid' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.status(200).json({ message: 'Orden confirmada', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al confirmar la orden' });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    // Encuentra todas las órdenes del usuario
    const orders = await Order.find({ user: userId }).populate('products.product');

    if (!orders.length) {
      return res.status(404).json({ message: 'No tienes compras realizadas' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las compras realizadas' });
  }
};




module.exports = { payOrder , getCartItems  , confirmOrder,getMyOrders};