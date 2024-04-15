const CustomerService = require('../service/customerService.js')

class CustomerController {
  // [POST] /customers
  async create(req, res, next) {
    return CustomerService.createCustomer(req, res, next)
  }

  // [GET] /customers
  async list(req, res, next) {
    return CustomerService.getAllCustomer(req, res, next)
  }

  // [GET] /customers/:id
  async get(req, res, next) {
    return CustomerService.getCustomerById(req, res, next)
  }

  // [PUT] /customers/:id
  async update(req, res, next) {
    return CustomerService.updateCustomer(req, res, next)
  }

  // [DELETE] /customers/:id
  async delete(req, res, next) {
    return CustomerService.deleteCustomer(req, res, next)
  }
}

module.exports = new CustomerController()
