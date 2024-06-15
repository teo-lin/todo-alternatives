const Router = require('@koa/router')
const UserService = require('./user.service')

class UserController {
  static createUser(ctx) {
    try {
      const user = UserService.createUser(ctx.request.body)
      ctx.status = 201
      ctx.body = user
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }

  static retrieveUser(ctx) {
    try {
      const user = UserService.retrieveUser(ctx.params.id)
      if (!user) ctx.throw(404, 'User not found')
      ctx.body = user
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }

  static updateUser(ctx) {
    try {
      const user = UserService.updateUser(ctx.params.id, ctx.request.body)
      ctx.body = user
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }

  static deleteUser(ctx) {
    try {
      UserService.deleteUser(ctx.params.id)
      ctx.body = { message: 'User deleted successfully' }
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }
}

const userRouter = new Router({ prefix: '/api/users' })
userRouter.post('/register', UserController.createUser)
userRouter.get('/user/:id', UserController.retrieveUser)
userRouter.put('/user/:id', UserController.updateUser)
userRouter.delete('/user/:id', UserController.deleteUser)

module.exports = userRouter
