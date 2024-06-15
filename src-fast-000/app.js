const fastify = require('fastify')
const userRouter = require('./modules/user/user.controller')
const taskRouter = require('./modules/task/task.controller')
const listRouter = require('./modules/list/list.controller')
const DatabaseService = require('./modules/database/database.service')

// DATABASE
DatabaseService.init()

// ROUTER
const app = fastify()

// MIDDLEWARE
// Fastify comes with an internal json parser, no need for one
// app.all('*', (req, res) => res.status(404).send({ message: 'Route not found' }))

// ROUTES
app.register(userRouter, { prefix: '/api' })
app.register(taskRouter, { prefix: '/api' })
app.register(listRouter, { prefix: '/api' })

// SERVER
const PORT = 3000
app.listen({ port: PORT, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server is running on ${address}`)
})
