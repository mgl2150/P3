const Customer = require('../models/Customer')
const { handleError, validateAndUpdateDocument } = require('../utils')

const CustomerService = {
  createCustomer: async (req, res) => {
    const { name, address, phone, email } = req.body
    try {
      const newCustomer = new Customer({ name, address, phone, email })
      const savedCustomer = await newCustomer.save()
      res.status(201).json(savedCustomer)
    } catch (err) {
      console.log(err)
      handleError(err, res, 'Failed to create customer')
    }
  },

  getAllCustomer: async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''

    const skip = (page - 1) * limit

    const searchQuery = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    }

    try {
      const data = await Customer.find(searchQuery)
        .select('-bikes -orders')
        .skip(skip)
        .limit(limit)
        .exec()

      const totalCount = await Customer.countDocuments(searchQuery)
      res.json({
        page,
        limit,
        totalCount,
        data,
      })
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve customers' })
    }
  },

  getCustomerById: async (req, res) => {
    const customerId = req.params.id

    try {
      const customer = await Customer.findById(customerId)

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' })
      }

      res.json(customer)
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve customer' })
    }
  },

  updateCustomer: async (req, res) => {
    const customerId = req.params.id

    try {
      const customer = await Customer.findById(customerId)

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' })
      }

      const excludedFields = ['bikes', 'orders']
      const updatedCustomer = await validateAndUpdateDocument(
        customer,
        req.body,
        excludedFields
      )

      res.json(updatedCustomer)
    } catch (err) {
      handleError(err, res, 'Failed to update customer')
    }
  },

  deleteCustomer: async (req, res) => {
    const customerId = req.params.id
    try {
      const deletedCustomer = await Customer.findByIdAndDelete(customerId)
      if (!deletedCustomer) {
        return res.status(404).json({ message: 'Customer not found' })
      }
      res.json({ message: 'Customer deleted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete customer' })
    }
  },
}

module.exports = CustomerService
