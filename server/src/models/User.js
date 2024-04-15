const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ROLES = { admin: 'ADMIN', staff: 'STAFF' }

const User = new Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true },
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
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      minlength: [10, 'Phone number must be at least 10 characters'],
      maxlength: [15, 'Phone number cannot exceed 15 characters'],
    },
    address: { type: String, required: true },
    identityNumber: { type: String, required: true, length: 12 },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, enum: ROLES, default: ROLES.staff, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', User)
