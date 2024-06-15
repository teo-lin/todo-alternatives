import fastify, { FastifyInstance } from 'fastify';
import userRouter from './modules/user/user.controller';
import taskRouter from './modules/task/task.controller';
import listRouter from './modules/list/list.controller';
import DatabaseService from './modules/database/database.service';

// DATABASE
DatabaseService.init();

// ROUTER
const app: FastifyInstance = fastify();

// MIDDLEWARE
// Fastify comes with an internal json parser, no need for one
// app.all('*', (req, res) => res.status(404).send({ message: 'Route not found' }))

// ROUTES
app.register(userRouter, { prefix: '/api' });
app.register(taskRouter, { prefix: '/api' });
app.register(listRouter, { prefix: '/api' });
app.get('/api', (req, res) => res.send('Hello World!'));

// SERVER
const PORT = 3000;
app.listen({ port: PORT, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server is running on ${address}`);
});
