const express = require('express');
const userRouter = require('./modules/user/user.controller');
const taskRouter = require('./modules/task/task.controller');
const listRouter = require('./modules/list/list.controller');
const DatabaseService = require('./modules/database/database.service');

// DATABASE
DatabaseService.init();

// ROUTER
const app = express();
const router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/api', router);

// ROUTES
router.use('/users', userRouter);
router.use('/tasks', taskRouter);
router.use('/lists', listRouter);
router.get('/', (req, res) => res.send('Hello World!'));

// SERVER
const PORT = 3000;
const startTime = new Date();
app.listen(PORT, () => {
  const endTime = new Date();
  const startupTime = endTime - startTime;
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server started in ${startupTime} ms`);
});
