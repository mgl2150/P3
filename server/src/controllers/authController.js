const AuthService = require('../service/authService.js')

class AuthController {
  // [POST] /auth/login
  async login(req, res, next) {
    return AuthService.login(req, res, next)
  }

  // [GET] /auth/profile
  async getProfile(req, res, next) {
    return AuthService.getProfile(req, res, next)
  }

  // [POST] /auth/refesh
  async refesh(req, res, next) {
    return AuthService.requestRefeshToken(req, res, next)
  }
}

module.exports = new AuthController()
