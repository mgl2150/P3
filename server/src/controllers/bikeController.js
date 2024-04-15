const bikeService = require('../service/bikeService.js')

class BikeController {
  // [POST] api/bikes
  async create(req, res, next) {
    return bikeService.createBike(req, res, next)
  }

  // [GET] api/bikes
  async list(req, res, next) {
    return bikeService.getAllBike(req, res, next)
  }

  // [GET] api/bikes/:id
  async get(req, res, next) {
    return bikeService.getBikeById(req, res, next)
  }

  // [PUT] api/bikes/:id
  async update(req, res, next) {
    return bikeService.updateBike(req, res, next)
  }

  // [DELETE] api/bikes/:id
  async delete(req, res, next) {
    return bikeService.deleteBike(req, res, next)
  }
}

module.exports = new BikeController()
