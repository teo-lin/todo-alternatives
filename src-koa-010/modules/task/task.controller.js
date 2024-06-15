const Router = require('@koa/router')
const TaskService = require('./task.service')

class TaskController {
  static createTask(ctx) {
    try {
      const task = TaskService.createTask(ctx.request.body)
      ctx.status = 201
      ctx.body = task
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }

  static retrieveTask(ctx) {
    try {
      const task = TaskService.retrieveTask(ctx.params.id)
      if (!task) ctx.throw(404, 'Task not found')
      ctx.body = task
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }

  static updateTask(ctx) {
    try {
      const task = TaskService.updateTask(ctx.params.id, ctx.request.body)
      ctx.body = task
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }

  static deleteTask(ctx) {
    try {
      TaskService.deleteTask(ctx.params.id)
      ctx.body = { message: 'Task deleted successfully' }
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }

  static completeTask(ctx) {
    try {
      const taskId = ctx.params.id
      const task = TaskService.completeTask(taskId)
      if (!task) ctx.throw(404, 'Task not found')
      ctx.body = task
    } catch (error) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }
}

const taskRouter = new Router({ prefix: '/api/tasks' })
taskRouter.post('/create', TaskController.createTask)
taskRouter.get('/task/:id', TaskController.retrieveTask)
taskRouter.put('/task/:id', TaskController.updateTask)
taskRouter.delete('/task/:id', TaskController.deleteTask)
taskRouter.patch('/task/:id/complete', TaskController.completeTask)

module.exports = taskRouter
