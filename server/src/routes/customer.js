const express = require('express')
const customerController = require('../controllers/customerController.js')
// const verifyAccessToken = require('../middlewares/verifyAccessToken.js')

const route = express.Router()

// route.use(verifyAccessToken)

route.post('/', customerController.create)
route.delete('/:id', customerController.delete)
route.put('/:id', customerController.update)
route.get('/:id', customerController.get)
route.get('/', customerController.list)

module.exports = route
