const fastify = require('fastify')
const ListService = require('./list.service')

class ListController {
  static createList(req, res) {
    try {
      const list = ListService.createList(req.body)
      res.code(201).send(list)
    } catch (error) {
      res.code(500).send({ message: error.message })
    }
  }
  static retrieveList(req, res) {
    try {
      const list = ListService.retrieveList(req.params.id)
      res.send(list)
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'List not found' })
      else res.code(500).send({ message: error.message })
    }
  }
  static updateList(req, res) {
    try {
      const list = ListService.updateList(req.params.id, req.body)
      res.send(list)
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'List not found' })
      else res.code(500).send({ message: error.message })
    }
  }
  static deleteList(req, res) {
    try {
      ListService.deleteList(req.params.id)
      res.send({ message: 'List deleted successfully' })
    } catch (error) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'List not found' })
      else res.code(500).send({ message: error.message })
    }
  }
}

module.exports = function (fastify, options, done) {
  fastify.post('/lists/create', ListController.createList)
  fastify.get('/lists/list/:id', ListController.retrieveList)
  fastify.put('/lists/list/:id', ListController.updateList)
  fastify.delete('/lists/list/:id', ListController.deleteList)
  done()
}
