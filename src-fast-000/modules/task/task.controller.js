const fastify = require('fastify')
const TaskService = require('./task.service')

class TaskController {
  static createTask(req, res) {
    try {
      const task = TaskService.createTask(req.body)
      res.code(201).send(task)
    } catch (error) {
      res.code(500).send({ message: error.message })
    }
  }
  static retrieveTask(req, res) {
    try {
      const task = TaskService.retrieveTask(req.params.id)
      res.send(task)
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'Task not found' })
      else res.code(500).send({ message: error.message })
    }
  }
  static updateTask(req, res) {
    try {
      const task = TaskService.updateTask(req.params.id, req.body)
      res.send(task)
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'Task not found' })
      else res.code(500).send({ message: error.message })
    }
  }
  static deleteTask(req, res) {
    try {
      TaskService.deleteTask(req.params.id)
      res.send({ message: 'Task deleted successfully' })
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'Task not found' })
      else res.code(500).send({ message: error.message })
    }
  }
  static completeTask(req, res) {
    try {
      const taskId = req.params.id
      const task = TaskService.completeTask(taskId)
      res.send(task)
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'Task not found' })
      else res.code(500).send({ message: error.message })
    }
  }
}

module.exports = function (fastify, options, done) {
  fastify.post('/tasks/create', TaskController.createTask)
  fastify.get('/tasks/task/:id', TaskController.retrieveTask)
  fastify.put('/tasks/task/:id', TaskController.updateTask)
  fastify.delete('/tasks/task/:id', TaskController.deleteTask)
  fastify.patch('/tasks/task/:id/complete', TaskController.completeTask)
  done()
}
