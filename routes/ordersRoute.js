const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(
  'sk_test_51NneHgKlJn4JJiGpvVyA8mgU5tIsg8pEM8lcTQwASnfCCzg4P6QI87qzPMr9vk9bqZV03drBYR5mXUu4IHS2JCNs00zrOkY7oc'
);
const Order = require('../models/orderModel');

// add orders controller
router.post('/placeorder', async (req, res) => {
  const { token, subtotal, currentUser, cartItems } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: subtotal * 100,
        currency: 'usd',
        customer: customer.id,
        receipt_email: token.email,
      },
      { idempotencyKey: uuidv4() }
    );
    if (payment) {
      const newOrder = new Order({
        name: currentUser.name,
        email: currentUser.email,
        userId: currentUser._id,
        orderItems: cartItems,
        orderAmount: subtotal,
        shippingAddress: {
          street: token.card.address_line1,
          city: token.card.address_city,
          country: token.card.address_country,
          pinCode: token.card.address_zip,
        },
        transactionId: payment.source.id,
      });
      newOrder.save();

      res.send('Order placed successfully');
    } else {
      res.send('Payment Failed');
    }
  } catch (error) {
    return res.status(400).json({ message: 'Something went wrong' });
  }
});

// Get user order details
router.post('/getuserorders', async (req, res) => {
  const { userId } = req.body;
  try {
    const orders = await Order.find({
      userId: userId,
    }).sort({ createdAt: -1 });
    res.send(orders);
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' });
  }
});

// Get all orders
router.get('/getallorders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// Deliver order

router.post('/deliverorder', async (req, res) => {
  const orderId = req.body.orderId;

  try {
    const order = await Order.findOne({ _id: orderId });
    order.isDelivered = true;
    await order.save();
    res.send('Order has been delivered');
  } catch (error) {
    return res.status(400).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
