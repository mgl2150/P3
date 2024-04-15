const express = require('express')
const bikeController = require('../controllers/bikeController.js')
const verifyAccessToken = require('../middlewares/verifyAccessToken.js')

const route = express.Router()

// route.use(verifyAccessToken)

route.post('/', bikeController.create)
route.delete('/:id', bikeController.delete)
route.put('/:id', bikeController.update)
route.get('/:id', bikeController.get)
route.get('/', bikeController.list)

module.exports = route
