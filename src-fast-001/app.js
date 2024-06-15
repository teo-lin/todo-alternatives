const fastify = require('fastify')
const fs = require('fs')
const path = require('path')

// CONTROLLERS
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

// SERVICES
class UserService {
  static createUser(userData) {
    const data = DatabaseService.getData()
    const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`
    const user = { userId: nextUserId, ...userData }

    data.users.push(user)
    data.lastUserId = nextUserId
    DatabaseService.setData(data)

    const { password, ...maskedUser } = user
    return maskedUser
  }

  static retrieveUser(userId) {
    const data = DatabaseService.getData()
    const user = data.users.find((user) => user.userId === userId)

    if (!user) throw new Error('Not Found')
    else {
      const { password, ...maskedUser } = user
      return maskedUser
    }
  }

  static updateUser(userId, userData) {
    const data = DatabaseService.getData()
    const userIndex = data.users.findIndex((user) => user.userId === userId)
    if (userIndex === -1) throw new Error('Not Found')
    const user = { ...data.users[userIndex], ...userData }

    data.users[userIndex] = user
    DatabaseService.setData(data)

    const { password, ...maskedUser } = user
    return maskedUser
  }

  static deleteUser(userId) {
    const data = DatabaseService.getData()
    const totalRecords = data.users.length

    data.users = data.users.filter((user) => user.userId !== userId)
    if (totalRecords === data.users.length) throw new Error('Not Found')
    else DatabaseService.setData(data)
  }
}
class TaskService {
  static createTask(taskData) {
    const data = DatabaseService.getData()
    const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`
    const task = { taskId: nextTaskId, ...taskData }

    data.tasks.push(task)
    data.lastTaskId = nextTaskId
    DatabaseService.setData(data)

    return task
  }

  static retrieveTask(taskId) {
    const data = DatabaseService.getData()

    const task = data.tasks.find((task) => task.taskId === taskId)
    if (!task) throw new Error('Not Found')
    else return task
  }

  static updateTask(taskId, taskData) {
    const data = DatabaseService.getData()
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
    if (taskIndex === -1) throw new Error('Not Found')
    const task = { ...data.tasks[taskIndex], ...taskData }

    data.tasks[taskIndex] = task
    DatabaseService.setData(data)

    return task
  }

  static deleteTask(taskId) {
    const data = DatabaseService.getData()
    const totalRecords = data.tasks.length

    data.tasks = data.tasks.filter((task) => task.taskId !== taskId)
    if (totalRecords === data.tasks.length) throw new Error('Not Found')
    else DatabaseService.setData(data)
  }

  static completeTask(taskId) {
    const data = DatabaseService.getData()
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)

    if (taskIndex === -1) throw new Error('Not Found')
    else {
      data.tasks[taskIndex].isComplete = true
      DatabaseService.setData(data)
      return data.tasks[taskIndex]
    }
  }
}
class ListService {
  static createList(listData) {
    const data = DatabaseService.getData()
    const nextListId = `L${1 + Number(data.lastListId.slice(1))}`
    const list = { listId: nextListId, ...listData }

    data.lists.push(list)
    data.lastListId = nextListId
    DatabaseService.setData(data)

    return list
  }

  static retrieveList(listId) {
    const data = DatabaseService.getData()

    const list = data.lists.find((list) => list.listId === listId)
    if (!list) throw new Error('Not Found')
    else return list
  }

  static updateList(listId, listData) {
    const data = DatabaseService.getData()
    const listIndex = data.lists.findIndex((list) => list.listId === listId)
    if (listIndex === -1) throw new Error('Not Found')
    const list = { ...data.lists[listIndex], ...listData }

    data.lists[listIndex] = list
    DatabaseService.setData(data)

    return list
  }

  static deleteList(listId) {
    const data = DatabaseService.getData()
    const totalRecords = data.lists.length

    data.lists = data.lists.filter((list) => list.listId !== listId)
    if (totalRecords === data.lists.length) throw new Error('Not Found')
    else DatabaseService.setData(data)
  }
}

class DatabaseService {
  static #db

  static init(filePath) {
    this.#db = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  static getData() {
    return this.#db
  }

  static setData(data) {
    this.#db = data
  }

  static saveToDisk(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.#db), 'utf8')
  }
}

// DATABASE
const PATH = path.join(__dirname, './db.json')
DatabaseService.init(PATH)

// ROUTER
const app = fastify()

// MIDDLEWARE
// Fastify comes with an internal json parser, no need for one
const pre = '/api'

// ROUTES
app.post(pre + '/users/register', UserController.createUser)
app.get(pre + '/users/user/:id', UserController.retrieveUser)
app.put(pre + '/users/user/:id', UserController.updateUser)
app.delete(pre + '/users/user/:id', UserController.deleteUser)
app.post(pre + '/tasks/create', TaskController.createTask)
app.get(pre + '/tasks/task/:id', TaskController.retrieveTask)
app.put(pre + '/tasks/task/:id', TaskController.updateTask)
app.delete(pre + '/tasks/task/:id', TaskController.deleteTask)
app.patch(pre + '/tasks/task/:id/complete', TaskController.completeTask)
app.post(pre + '/lists/create', ListController.createList)
app.get(pre + '/lists/list/:id', ListController.retrieveList)
app.put(pre + '/lists/list/:id', ListController.updateList)
app.delete(pre + '/lists/list/:id', ListController.deleteList)
// app.get(pre + '/', async (req, res) => {message: 'Hello World!'})
// app.all('*', (req, res) => res.status(404).send({ message: 'Route not found' }))

// SERVER
const PORT = 3000
app.listen({ port: PORT, host: '127.0.0.1' }, (err, address) => {
  if (err) throw err
  console.log(`Server is running on ${address}`)
})
