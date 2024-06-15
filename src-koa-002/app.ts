import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import userRouter from './modules/user/user.controller';
import taskRouter from './modules/task/task.controller';
import listRouter from './modules/list/list.controller';
import DatabaseService from './modules/database/database.service';

// DATABASE
DatabaseService.init();

// ROUTER
const app: Koa = new Koa();

// MIDDLEWARE
app.use(bodyParser());

// ROUTES
app.use(userRouter.routes());
app.use(taskRouter.routes());
app.use(listRouter.routes());

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
