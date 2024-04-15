const mongoose = require('mongoose')

const STATUS = { working: 'WORKING', done: 'DONE', preOrder: 'PRE_ORDER', delivered: 'DELIVERED' }
const PAYMENTSTATUS = { paid: 'PAID', unpaid: 'UNPAID' }
const PAYMENTMETHOD = { cash: 'CASH', bankTransfer: 'BANKTRANSFER', null: null }

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        userFullName: {
          type: String,
          required: true,
        },
      }
    ],
    bike: {
      bikeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bike',
      },
      plateNumber: {
        type: String,
        required: true,
      },
    },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'services',
        },
        name: {
          type: String,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: STATUS,
      default: STATUS.working,
      required: true,
    },
    payment: {
      paymentStatus: {
        type: String,
        enum: PAYMENTSTATUS,
        default: PAYMENTSTATUS.unpaid,
        required: true,
      },
      paymentMethod: { type: String, enum: PAYMENTMETHOD, default: null },
      payAtTime: { type: Date },
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
