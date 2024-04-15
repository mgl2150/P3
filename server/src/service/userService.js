// const User = require('../models/User')
// const bcrypt = require('bcrypt')
// const { handleError } = require('../utils')
// const { userValidator } = require('../utils/validate')
// const { validateAndUpdateDocument } = require('../utils')

// const UserService = {
//   getAllUser: async (req, res) => {
//     const page = parseInt(req.query.page) || 1
//     const limit = parseInt(req.query.limit) || 10
//     const search = req.query.search || ''
//     const skip = (page - 1) * limit

//     const searchQuery = {
//       $or: [
//         { username: { $regex: search, $options: 'i' } },
//         { fullName: { $regex: search, $options: 'i' } },
//       ],
//     }
//     try {
//       const data = await User.find(searchQuery)
//         .select('-password')
//         .skip(skip)
//         .limit(limit)
//         .exec()
//       const totalCount = await User.countDocuments(searchQuery)
//       res.status(200).json({
//         page,
//         limit,
//         totalCount,
//         data,
//       })
//     } catch (error) {
//       handleError(error, res, 'Failed to retrieve Users')
//     }
//   },

//   createUser: async (req, res) => {
//     const { error } = userValidator(req.body)
//     if (error) return res.status(400).json(error)

//     try {
//       const exitedUser = await User.findOne({ username: req.body.username })
//       if (exitedUser) return res.status(401).json('Username is already in use')
//       const hashedPassword = await bcrypt.hash(req.body.password.toString(), 10)
//       const user = new User({
//         ...req.body,
//         password: hashedPassword,
//       })
//       await user.save()
//       res.status(201).json({
//         _id: user._id,
//         fullName: user.fullName,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//         identityNumber: user.fullName,
//         address: user.address,
//         role: user.role,
//       })
//     } catch (err) {
//       handleError(err, res, 'Failed to create User')
//     }
//   },

//   getUserById: async (req, res) => {
//     const id = req.params.id
//     try {
//       const user = await User.findById(id).select('-password')
//       res.status(200).json(user)
//     } catch (err) {
//       handleError(err, res, 'Failed to retrieve User')
//     }
//   },

//   updateUser: async (req, res) => {
//     const userId = req.params.id
//     const { error } = userValidator(req.body)
//     if (error) return res.status(400).json(error)
//     const newUsername = req.body.username
//     try {
//       const user = await User.findById(userId)
//       if (!user) return res.status(404).json({ message: 'User not found' })
//       if (newUsername !== user.username) {
//         const anotherUser = await User.findOne({ username: newUsername })
//         if (anotherUser)
//           return res.status(400).json({ message: 'Username is exiting' })
//       }
//       const hashedPassword = await bcrypt.hash(req.body.password.toString(), 10)
//       const data = { ...req.body, password: hashedPassword }
//       await validateAndUpdateDocument(user, data)
//       res.status(200).json({
//         _id: user._id,
//         fullName: user.fullName,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//         identityNumber: user.fullName,
//         address: user.address,
//         role: user.role,
//       })
//     } catch (err) {
//       handleError(err, res, 'Failed to update user')
//     }
//   },

//   deleteUser: async (req, res) => {
//     const id = req.params.id
//     try {
//       const user = await User.findByIdAndDelete(id)
//       if (!user) return res.status(404).json({ message: 'User not found' })
//       res.json({
//         message: 'User deleted successfully',
//       })
//     } catch (err) {
//       handleError(err, res, 'Failed to delete user')
//     }
//   },
// }

// module.exports = UserService
