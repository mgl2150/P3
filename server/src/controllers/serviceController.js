const RepairService = require('../service/repairServiceService.js')

class ServiceController {
  // [POST] /services
  async create(req, res, next) {
    return RepairService.createService(req, res, next)
  }

  // [GET] /services
  async list(req, res, next) {
    return RepairService.getAllService(req, res, next)
  }

  // [GET] /services/types`
  async getTypes(req, res, next) {
    return RepairService.getAllServiceType(req, res, next)
  }
  // [GET] /services/:id
  async get(req, res, next) {
    return RepairService.getServiceById(req, res, next)
  }

  // [PUT] /services/:id
  async update(req, res, next) {
    return RepairService.updateService(req, res, next)
  }

  // [PUT] /services/
  async updateMany(req, res, next) {
    return RepairService.updateMany(req, res, next)
  }

  // [DELETE] /services/:id
  async delete(req, res, next) {
    return RepairService.deleteService(req, res, next)
  }
}

module.exports = new ServiceController()
