const http = require('http')
const fs = require('fs')
const path = require('path')

// CONTROLLERS
class UserController {
  static createUser(req, res) {
    try {
      const body = JSON.parse(req.body)
      const user = UserService.createUser(body)
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(user))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static retrieveUser(req, res) {
    try {
      const user = UserService.retrieveUser(req.params.id)
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'User not found' }))
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(user))
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static updateUser(req, res) {
    try {
      const user = UserService.updateUser(req.params.id, JSON.parse(req.body))
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(user))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static deleteUser(req, res) {
    try {
      UserService.deleteUser(req.params.id)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'User deleted successfully' }))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
}
class TaskController {
  static createTask(req, res) {
    try {
      const body = JSON.parse(req.body)
      const task = TaskService.createTask(body)
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(task))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static retrieveTask(req, res) {
    try {
      const task = TaskService.retrieveTask(req.params.id)
      if (!task) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Task not found' }))
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(task))
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static updateTask(req, res) {
    try {
      const task = TaskService.updateTask(req.params.id, JSON.parse(req.body))
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(task))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static deleteTask(req, res) {
    try {
      TaskService.deleteTask(req.params.id)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Task deleted successfully' }))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static completeTask(req, res) {
    try {
      const taskId = req.params.id
      const task = TaskService.completeTask(taskId)
      if (!task) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Task not found' }))
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(task))
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
}
class ListController {
  static createList(req, res) {
    try {
      const body = JSON.parse(req.body)
      const list = ListService.createList(body)
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(list))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static retrieveList(req, res) {
    try {
      const list = ListService.retrieveList(req.params.id)
      if (!list) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'List not found' }))
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(list))
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static updateList(req, res) {
    try {
      const list = ListService.updateList(req.params.id, JSON.parse(req.body))
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(list))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  }
  static deleteList(req, res) {
    try {
      ListService.deleteList(req.params.id)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'List deleted successfully' }))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
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
    delete user.password
    return user
  }
  static retrieveUser(userId) {
    const data = DatabaseService.getData()
    const user = data.users.find((user) => user.userId === userId)
    if (user) delete user.password
    return user
  }
  static updateUser(userId, userData) {
    const data = DatabaseService.getData()
    const userIndex = data.users.findIndex((user) => user.userId === userId)
    if (userIndex === -1) throw new Error('User not found')
    data.users[userIndex] = { ...data.users[userIndex], ...userData }
    DatabaseService.setData(data)
    const user = data.users[userIndex]
    delete user.password
    return user
  }
  static deleteUser(userId) {
    const data = DatabaseService.getData()
    data.users = data.users.filter((user) => user.userId !== userId)
    DatabaseService.setData(data)
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
    return data.lists.find((list) => list.listId === listId)
  }
  static updateList(listId, listData) {
    const data = DatabaseService.getData()
    const listIndex = data.lists.findIndex((list) => list.listId === listId)
    if (listIndex === -1) throw new Error('List not found')
    data.lists[listIndex] = { ...data.lists[listIndex], ...listData }
    DatabaseService.setData(data)
    return data.lists[listIndex]
  }
  static deleteList(listId) {
    const data = DatabaseService.getData()
    data.lists = data.lists.filter((list) => list.listId !== listId)
    DatabaseService.setData(data)
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
    return data.tasks.find((task) => task.taskId === taskId)
  }
  static updateTask(taskId, taskData) {
    const data = DatabaseService.getData()
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...taskData }
    DatabaseService.setData(data)
    return data.tasks[taskIndex]
  }
  static deleteTask(taskId) {
    const data = DatabaseService.getData()
    data.tasks = data.tasks.filter((task) => task.taskId !== taskId)
    DatabaseService.setData(data)
  }
  static completeTask(taskId) {
    const data = DatabaseService.getData()
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    data.tasks[taskIndex].isComplete = true
    DatabaseService.setData(data)
    return data.tasks[taskIndex]
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

// MIDDLEWARE

// ROUTES

// SERVER
const PORT = 3000
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const [_, api, entity, action, id, operation] = url.pathname.split('/')
  if (api !== 'api') return routeNotFound(res)

  let body = []
  req
    .on('data', (chunk) => {
      body.push(chunk)
    })
    .on('end', () => {
      body = Buffer.concat(body).toString()

      switch (entity) {
        case 'users':
          switch (action) {
            case 'register':
              UserController.createUser({ body }, res)
              break
            case 'user':
              switch (req.method) {
                case 'GET':
                  if (id) UserController.retrieveUser({ params: { id } }, res)
                  break
                case 'PUT':
                  if (id) UserController.updateUser({ params: { id }, body }, res)
                  break
                case 'DELETE':
                  if (id) UserController.deleteUser({ params: { id } }, res)
                  break
                default:
                  routeNotFound(res)
              }
              break
            default:
              routeNotFound(res)
          }
          break
        case 'tasks':
          switch (action) {
            case 'create':
              TaskController.createTask({ body }, res)
              break
            case 'task':
              switch (req.method) {
                case 'GET':
                  if (id) TaskController.retrieveTask({ params: { id } }, res)
                  break
                case 'PUT':
                  if (id) TaskController.updateTask({ params: { id }, body }, res)
                  break
                case 'DELETE':
                  if (id) TaskController.deleteTask({ params: { id } }, res)
                  break
                case 'PATCH':
                  if (id && operation === 'complete')
                    TaskController.completeTask({ params: { id } }, res)
                  break
                default:
                  routeNotFound(res)
              }
              break
            default:
              routeNotFound(res)
          }
          break
        case 'lists':
          switch (action) {
            case 'create':
              ListController.createList({ body }, res)
              break
            case 'list':
              switch (req.method) {
                case 'GET':
                  if (id) ListController.retrieveList({ params: { id } }, res)
                  break
                case 'PUT':
                  if (id) ListController.updateList({ params: { id }, body }, res)
                  break
                case 'DELETE':
                  if (id) ListController.deleteList({ params: { id } }, res)
                  break
                default:
                  routeNotFound(res)
              }
              break
            default:
              routeNotFound(res)
          }
          break
        default:
          routeNotFound(res)
      }
    })
})

function routeNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Route not found' }))
}

server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
