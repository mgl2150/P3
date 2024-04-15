const express = require('express')
const scheduleController = require('../controllers/scheduleController.js')

const route = express.Router()

route.post('/', scheduleController.create)
route.get('/', scheduleController.list)
route.put('/:id', scheduleController.update)
route.delete('/:id', scheduleController.delete)
module.exports = route
