const fastify = require('fastify')
const UserService = require('./user.service')

class UserController {
  static createUser(req, res) {
    try {
      const user = UserService.createUser(req.body)
      res.code(201).send(user)
    } catch (error) {
      res.code(500).send({ message: error.message })
    }
  }
  static retrieveUser(req, res) {
    try {
      const user = UserService.retrieveUser(req.params.id)
      res.send(user)
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'User not found' })
      else res.code(500).send({ message: error.message })
    }
  }
  static updateUser(req, res) {
    try {
      const user = UserService.updateUser(req.params.id, req.body)
      res.send(user)
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'User not found' })
      else res.code(500).send({ message: error.message })
    }
  }
  static deleteUser(req, res) {
    try {
      UserService.deleteUser(req.params.id)
      res.send({ message: 'User deleted successfully' })
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'User not found' })
      else res.code(500).send({ message: error.message })
    }
  }
}

module.exports = function (fastify, options, done) {
  fastify.post('/users/register', UserController.createUser)
  fastify.get('/users/user/:id', UserController.retrieveUser)
  fastify.put('/users/user/:id', UserController.updateUser)
  fastify.delete('/users/user/:id', UserController.deleteUser)
  done()
}
