const { default: mongoose } = require('mongoose')
const Service = require('../models/Service')
const { handleError, validateAndUpdateDocument } = require('../utils')

const RepairService = {
  createService: async (req, res) => {
    const { name, cost, type } = req.body
    try {
      const newService = new Service({ name, cost, type })
      const savedService = await newService.save()
      res.status(201).json(savedService)
    } catch (err) {
      handleError(err, res, 'Failed to create service')
    }
  },

  getAllServiceType: async (req, res) => {
    const serviceTypes = await Service.find().distinct('type')
    res.json({ serviceTypes })
  },

  getAllService: async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const type = req.query.type || null

    const skip = (page - 1) * limit

    const searchQuery = type
      ? {
          $and: [{ name: { $regex: search, $options: 'i' } }, { type }],
        }
      : { name: { $regex: search, $options: 'i' } }

    try {
      const data = await Service.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .exec()

      const totalCount = await Service.countDocuments(searchQuery)
      res.json({
        page,
        limit,
        totalCount,
        data,
      })
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve services' })
    }
  },

  getServiceById: async (req, res) => {
    const serviceId = req.params.id

    try {
      const service = await Service.findById(serviceId)

      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }

      res.json(service)
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve service' })
    }
  },

  updateService: async (req, res) => {
    const serviceId = req.params.id

    try {
      const service = await Service.findById(serviceId)

      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }

      const updatedService = await validateAndUpdateDocument(service, req.body)

      res.json(updatedService)
    } catch (err) {
      handleError(err, res, 'Failed to update service')
    }
  },

  updateMany: async (req, res) => {
    const { add, update, delete: toDelete } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      if (add && Array.isArray(add)) {
        await Service.create(add, { session })
      }

      if (update && Array.isArray(update)) {
        for (const item of update) {
          const { _id, ...updates } = item
          await Service.findByIdAndUpdate(_id, updates, {
            new: true,
            session,
          })
        }
      }

      if (toDelete && Array.isArray(toDelete)) {
        await Service.deleteMany({ _id: { $in: toDelete } }, { session })
      }

      await session.commitTransaction()
      session.endSession()

      res.status(200).json({ message: 'Service updated successfully' })
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      res.status(500).json({ error: 'An error occurred, failed to update' })
    }
  },

  deleteService: async (req, res) => {
    const serviceId = req.params.id
    try {
      const deletedService = await Service.findByIdAndDelete(serviceId)
      if (!deletedService) {
        return res.status(404).json({ message: 'Service not found' })
      }
      res.json({ message: 'Service deleted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete service' })
    }
  },
}

module.exports = RepairService
