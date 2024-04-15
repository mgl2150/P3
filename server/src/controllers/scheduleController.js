const ScheduleService = require('../service/scheduleService.js')

class ScheduleController {
  // [POST] /Schedules
  async create(req, res, next) {
    return ScheduleService.createSchedule(req, res, next)
  }

  // [GET] /Schedules
  async list(req, res, next) {
    return ScheduleService.getAllSchedules(req, res, next)
  }

  async update(req, res, next) {
    return ScheduleService.updateSchedule(req, res, next)
  }

  async delete(req, res, next) {
    return ScheduleService.deleteSchedule(req, res, next)
  }
}

module.exports = new ScheduleController()
