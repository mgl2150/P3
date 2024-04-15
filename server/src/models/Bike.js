const mongoose = require('mongoose')

const bikeSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: [true, 'Plate number is required'],
      validate: {
        validator: (value) => {
          return /^(?:\d{2}[A-Z]-\d{3}\.\d{2}|\d{2}[A-Z]-\d{5})$/.test(value)
        },
        message: 'Invalid plate number',
      },
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Invalid value'],
      max: [new Date().getFullYear(), 'Invalid value'],
    },
    isRepaired: {
      type: Boolean,
      default: false,
    },
    isAtWorkShop: {
      type: Boolean,
      default: false,
    },
    customer: {
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
      },
      customerName: {
        type: String,
        required: true,
      },
    },

    repairs: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        cost: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
)

const Bike = mongoose.model('Bike', bikeSchema)

module.exports = Bike
