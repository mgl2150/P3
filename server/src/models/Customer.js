const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      minlength: [10, 'Phone number must be at least 10 characters'],
      maxlength: [15, 'Phone number cannot exceed 15 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      validate: {
        validator: (value) => {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
        },
        message: 'Invalid email format',
      },
    },
    bikes: [
      {
        bikeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Bike',
        },
        plateNumber: {
          type: String,
          required: true,
        },
      },
    ],

    orders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        name: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
)

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
