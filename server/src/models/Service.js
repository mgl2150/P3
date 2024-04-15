const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    cost: {
      type: Number,
      required: [true, 'Service Cost is required'],
    },
    type: {
      type: String,
      required: [true, 'Service Type number is required'],
    },
  },
  { timestamps: true }
)

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service
