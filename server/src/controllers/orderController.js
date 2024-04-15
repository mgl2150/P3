const orderService = require('../service/orderService.js')

class OrderController {
  // [POST] api/orders
  async create(req, res, next) {
    return orderService.createOrder(req, res, next)
  }

  // [GET] api/orders
  async list(req, res, next) {
    return orderService.getAllOrder(req, res, next)
  }

  // [GET] api/orders/:id
  async get(req, res, next) {
    return orderService.getOrderById(req, res, next)
  }

  // [PUT] api/orders/:id
  async update(req, res, next) {
    return orderService.updateOrder(req, res, next)
  }

  // [DELETE] api/orders/:id
  async delete(req, res, next) {
    return orderService.deleteOrder(req, res, next)
  }

  async getOrder(req, res, next) {
    return orderService.getOrderByUserId(req, res, next)
  }
}

module.exports = new OrderController()
