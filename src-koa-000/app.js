const Koa = require('koa');
const { bodyParser } = require('@koa/bodyparser');
const userRouter = require('./modules/user/user.controller');
const taskRouter = require('./modules/task/task.controller');
const listRouter = require('./modules/list/list.controller');
const DatabaseService = require('./modules/database/database.service');

// DATABASE
DatabaseService.init();

// ROUTER
const app = new Koa();

// MIDDLEWARE
app.use(bodyParser());

// ROUTES
app.use(userRouter.routes());
app.use(taskRouter.routes());
app.use(listRouter.routes());
app.use(async (ctx, next) => {
  if (ctx.path === '/api') ctx.body = 'Hello World!';
  else await next();
});

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
