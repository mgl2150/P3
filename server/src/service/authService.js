// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const User = require('../models/User.js')
// const { loginValidator } = require('../utils/validate.js')

// const AuthService = {
//   generateAccessToken: (user) => {
//     return jwt.sign(
//       {
//         _id: user._id,
//         username: user.username,
//         fullName: user.fullName,
//         role: user.role,
//       },
//       process.env.ACCESS_TOKEN_SECRET_KEY,
//       { expiresIn: '10h' }
//     )
//   },

//   generateRefeshToken: (user) => {
//     return jwt.sign(
//       {
//         _id: user._id,
//         username: user.username,
//         fullName: user.fullName,
//         role: user.role,
//       },
//       process.env.REFESH_TOKEN_SECRET_KEY,
//       { expiresIn: '1d' }
//     )
//   },

//   login: async (req, res) => {
//     // validate the data
//     const { error } = loginValidator(req.body)
//     if (error) return res.status(400).send(error.details[0].message)

//     try {
//       // check if username not found
//       const exitedUser = await User.findOne({ username: req.body.username })
//       if (!exitedUser) return res.status(404).send('Username not found')

//       // check if password is not correct
//       const isPasswordValid = await bcrypt.compare(
//         req.body.password,
//         exitedUser.password
//       )
//       if (!isPasswordValid)
//         return res.status(400).send('Password is not correct')

//       // create and assign access token and refresh token
//       const accessToken = AuthService.generateAccessToken(exitedUser)
//       const refeshToken = AuthService.generateRefeshToken(exitedUser)
//       res.json({
//         message: 'Login successful',
//         accessToken,
//         refeshToken,
//       })
//     } catch (error) {
//       throw new Error(error)
//     }
//   },

//   getProfile: async (req, res) => {
//     const user = req.user
//     res.status(200).json(user)
//   },

//   requestRefeshToken: (req, res) => {
//     // Bearer token
//     const refeshToken = req.headers.authorization?.split(' ')[1]
//     if (!refeshToken) return res.status(403).send('Access denied')
//     jwt.verify(
//       refeshToken,
//       process.env.REFESH_TOKEN_SECRET_KEY,
//       (err, user) => {
//         if (err) return res.status(401).send('refeshToken is invalid')
//         const newAccessToken = AuthService.generateAccessToken(user)

//         res.status(200).json({
//           newAccessToken,
//         })
//       }
//     )
//   },
// }

// module.exports = AuthService
