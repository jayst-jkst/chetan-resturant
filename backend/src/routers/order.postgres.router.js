import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { Order } from '../models/order.postgres.model.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserPostgresModel } from '../models/user.postgres.model.js';
import { sendEmailReceipt } from '../helpers/mail.helper.js';
import { Op } from 'sequelize';

const router = Router();
router.use(auth);

// Create a new order
router.post(
  '/create',
  handler(async (req, res) => {
    const order = req.body;

    if (!order.items || order.items.length <= 0) {
      res.status(BAD_REQUEST).send('Cart Is Empty!');
      return;
    }

    await Order.destroy({
      where: {
        userId: req.user.id,
        status: OrderStatus.NEW,
      },
    });

    const newOrder = await Order.create({ ...order, userId: req.user.id });
    res.send(newOrder);
  })
);

// Pay for an order
router.put(
  '/pay',
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);

    if (!order) {
      res.status(BAD_REQUEST).send('Order Not Found!');
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    sendEmailReceipt(order);

    res.send(order.id);
  })
);

// Track an order by ID
router.get(
  '/track/:orderId',
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserPostgresModel.findByPk(req.user.id);

    const filter = {
      id: orderId,
    };

    if (!user.isAdmin) {
      filter.userId = user.id;
    }

    const order = await Order.findOne({
      where: filter,
    });

    if (!order) {
      res.status(BAD_REQUEST).send('Order Not Found or Unauthorized!');
      return;
    }

    res.send(order);
  })
);

// Get new order for the current user
router.get(
  '/newOrderForCurrentUser',
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);

    if (order) res.send(order);
    else res.status(BAD_REQUEST).send();
  })
);

// Get all order statuses
router.get('/allstatus', (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

// Get orders by status or all orders
router.get(
  '/:status?',
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserPostgresModel.findByPk(req.user.id);

    const filter = {};
    if (!user.isAdmin) filter.userId = user.id;
    if (status) filter.status = status;

    const orders = await Order.findAll({
      where: filter,
      order: [['createdAt', 'DESC']],
    });

    res.send(orders);
  })
);

// Helper function to get the current user's new order
const getNewOrderForCurrentUser = async req => {
  return await Order.findOne({
    where: {
      userId: req.user.id,
      status: OrderStatus.NEW,
    },
    include: [{ model: UserPostgresModel }],
  });
};

export default router;
