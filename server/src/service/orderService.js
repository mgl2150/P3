const Order = require('../models/Order')
const Bike = require('../models/Bike')
const Customer = require('../models/Customer')
const {
  handleError,
  validateAndUpdateDocument,
  formatDate,
} = require('../utils')
const { Schema } = require('mongoose')

const OrderService = {
  createOrder: async (req, res) => {
    try {
      const newOrder = new Order(req.body)
      const savedOrder = await newOrder.save()
      const { name, customer, bike, startDate, endDate, totalCost } = savedOrder
      // update customer
      const updatedCustomer = await Customer.updateOne(
        { _id: customer.customerId },
        {
          $push: {
            orders: { orderId: savedOrder._id, name: name, date: startDate },
          },
        }
      )
      // update bike
      const updatedBike = await Bike.updateOne(
        { _id: bike.bikeId },
        {
          $push: {
            repairs: {
              orderId: savedOrder._id,
              startDate,
              endDate,
              cost: totalCost,
            },
          },
        }
      )
      res.status(201).json(savedOrder, updatedCustomer, updatedBike)
    } catch (err) {
      handleError(err, res, 'Failed to create Order')
    }
  },

  getAllOrder: async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const status = req.query.status || null
    const paymentStatus = req.query.paymentStatus || null
    const customerId = req.query.customerId
    const skip = (page - 1) * limit

    const queryCustomerId = customerId
      ? {
          'customer.customerId': customerId,
        }
      : {}
    const searchQuery = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { 'bike.plateNumber': { $regex: search, $options: 'i' } },
        { 'customer.customerName': { $regex: search, $options: 'i' } },
      ],
      status: status ? status : { $in: ['WORKING', 'DONE', 'PRE_ORDER', 'DELIVERED'] },
      'payment.paymentStatus': paymentStatus
        ? paymentStatus
        : { $in: ['PAID', 'UNPAID'] },

      ...queryCustomerId,
    }

    try {
      const data = await Order.find(searchQuery)
        .select('-services')
        .skip(skip)
        .limit(limit)
        .exec()

      const totalCount = await Order.countDocuments(searchQuery)
      res.json({
        page,
        limit,
        totalCount,
        data,
      })
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve Orders' })
    }
  },

  getOrderById: async (req, res) => {
    const orderId = req.params.id

    try {
      const order = await Order.findById(orderId)

      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }

      res.json(order)
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve Order' })
    }
  },

  getOrderByUserId: async (req, res) => {
    const userId = req.params.userId
    const ordersOfUser = []
      try {
        const orders = await Order.find()
        for (const order of orders) {

          const orderDoneBy = order.users
  
          const userNeeded = orderDoneBy.filter((user) => {
            return user.userId.equals(userId)
          })
          if (userNeeded.length > 0) {
            ordersOfUser.push(order)
          }
          else {
            continue
          }

        }
        res.status(200).json(ordersOfUser)
      } catch (error) {
        res.status(500).json(error)
      }
  },

  updateOrder: async (req, res) => {
    const orderId = req.params.id;
    const { name, startDate, endDate, totalCost, users } = req.body;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const excludedFields = ['customer', 'bike']; // Remove 'user' from excludedFields
      if (req.body.endDate) {
        req.body.endDate = formatDate(req.body.endDate);
      }
      if (req.body.startDate) {
        req.body.startDate = formatDate(req.body.startDate);
      }
      const updatedOrder = await validateAndUpdateDocument(
        order,
        {
          ...req.body,
        },
        excludedFields
      );
      res.json(updatedOrder);
  
      // Update users
      if (users) {
        order.users = users; // Update the users field in the order
        await order.save();
      }
  
      // Update customer
      if (name === updatedOrder.name && startDate === updatedOrder.startDate) {
        return;
      }
      await Customer.updateOne(
        {
          _id: updatedOrder.customer.customerId,
          'orders.orderId': orderId,
        },
        {
          $set: {
            'orders.$.name': updatedOrder.name,
            'orders.$.date': updatedOrder.startDate,
          },
        }
      );
  
      // Update bike
      if (
        startDate === updatedOrder.startDate &&
        endDate === updatedOrder.endDate &&
        totalCost === updatedOrder.totalCost
      ) {
        return;
      }
      await Bike.updateOne(
        {
          _id: updatedOrder.bike.bikeId,
          'repairs.orderId': orderId,
        },
        {
          $set: {
            'repairs.$.startDate': updatedOrder.startDate,
            'repairs.$.endDate': updatedOrder.endDate,
            'repairs.$.cost': updatedOrder.totalCost,
          },
        }
      );
    } catch (err) {
      console.log(err);
      handleError(err, res, 'Failed to update order');
    }
  },

  deleteOrder: async (req, res) => {
    const orderId = req.params.id
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId)
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' })
      }

      // update customer
      const customerId = deletedOrder.customer.customerId
      if (!customerId) return
      const customer = await Customer.findById(customerId)
      customer.orders = customer.orders.filter(
        (order) => order.orderId.toString() !== orderId
      )
      await customer.save()

      // update bike
      const bikeId = deletedOrder.bike.bikeId
      if (!bikeId) return
      const bike = await Bike.findById(bikeId)
      if (!bike) return
      bike.repairs = bike.repairs.filter((repair) => {
        return repair.orderId.toString() !== orderId
      })
      await bike.save()
      res.json({
        message: 'Order deleted successfully',
      })
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete Order' })
    }
  },
}

module.exports = OrderService
