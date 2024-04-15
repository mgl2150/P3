const Bike = require('../models/Bike')
const Customer = require('../models/Customer')
const { handleError, validateAndUpdateDocument } = require('../utils')

const BikeService = {
  createBike: async (req, res) => {
    const {
      plateNumber,
      brand,
      model,
      year,
      isRepaired,
      isAtWorkShop,
      customer,
      repairs,
    } = req.body
    try {
      const existedPlateNumber = await Bike.findOne({ plateNumber })
      if (existedPlateNumber)
        return res.status(401).json({ message: 'The plate number is existing' })

      const newBike = new Bike({
        plateNumber,
        brand,
        model,
        year,
        isRepaired,
        isAtWorkShop,
        customer,
        repairs,
      })
      const savedBike = await newBike.save()

      // update customer
      const existedCustomer = await Customer.findById(customer.customerId)
      existedCustomer.bikes.push({
        bikeId: savedBike._id,
        plateNumber: savedBike.plateNumber,
      })
      await existedCustomer.save()

      res.status(201).json(savedBike)
    } catch (err) {
      handleError(err, res, 'Failed to create Bike')
    }
  },

  getAllBike: async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''

    const skip = (page - 1) * limit

    const searchQuery = {
      $or: [
        { plateNumber: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ],
    }

    try {
      const data = await Bike.find(searchQuery)
        .select('-orders')
        .skip(skip)
        .limit(limit)
        .exec()

      const totalCount = await Bike.countDocuments(searchQuery)
      res.json({
        page,
        limit,
        totalCount,
        data,
      })
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve Bikes' })
    }
  },

  getBikeById: async (req, res) => {
    const bikeId = req.params.id

    try {
      const bike = await Bike.findById(bikeId)

      if (!bike) {
        return res.status(404).json({ message: 'Bike not found' })
      }

      res.json(bike)
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve Bike' })
    }
  },

  updateBike: async (req, res) => {
    const bikeId = req.params.id

    try {
      const bike = await Bike.findById(bikeId)
      const prevPlateNumber = bike.plateNumber
      if (!bike) {
        return res.status(404).json({ message: 'Bike not found' })
      }
      if (prevPlateNumber !== req.body.plateNumber) {
        const isAnotherBike = await Bike.findOne({
          plateNumber: req.body.plateNumber,
        })
        if (isAnotherBike)
          return res.status(400).json({ message: 'Plate number is exiting' })
      }

      const excludedFields = ['customers, orders']
      const updatedBike = await validateAndUpdateDocument(
        bike,
        req.body,
        excludedFields
      )
      res.json(updatedBike)

      // update customer
      if (prevPlateNumber === updatedBike.plateNumber) return
      const customerId = updatedBike.customer.customerId
      const customer = await Customer.findById(customerId)
      const indexBike = customer.bikes.findIndex(
        (bike) => bike.bikeId.toString() === bikeId
      )
      customer.bikes[indexBike].plateNumber = updatedBike.plateNumber
      await customer.save()
    } catch (err) {
      handleError(err, res, 'Failed to update Bike')
    }
  },

  deleteBike: async (req, res) => {
    const bikeId = req.params.id
    try {
      const deletedBike = await Bike.findByIdAndDelete(bikeId)
      if (!deletedBike) {
        return res.status(404).json({ message: 'Bike not found' })
      }
      res.json({
        message: 'Bike deleted successfully',
      })

      // update customer
      const customerId = deletedBike.customer.customerId
      if (!customerId) return
      const customer = await Customer.findById(customerId)
      customer.bikes = customer.bikes.filter(
        (bike) => bike.bikeId.toString() !== bikeId
      )
      await customer.save()
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete Bike' })
    }
  },
}

module.exports = BikeService
