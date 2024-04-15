const UserService = require('../service/userService')

class UserController {
  // [GET] api/users
  async list(req, res) {
    return UserService.getAllUser(req, res)
  }

  // [GET] api/users/:id
  async get(req, res) {
    return UserService.getUserById(req, res)
  }

  // [POST] api/users/
  async create(req, res) {
    return UserService.createUser(req, res)
  }

  // [UPDATE] api/users/:id
  async update(req, res) {
    return UserService.updateUser(req, res)
  }

  // [DELETE] api/users/:id
  async delete(req, res) {
    return UserService.deleteUser(req, res)
  }
}

module.exports = new UserController()
