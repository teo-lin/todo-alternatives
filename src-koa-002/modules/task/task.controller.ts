import Router from '@koa/router';
import { Context } from 'koa';
import TaskService from './task.service';
import { Task, NewTask } from '../interfaces';

class TaskController {
  static async createTask(ctx: Context) {
    try {
      const task: Task = await TaskService.createTask(ctx.request.body as NewTask);
      ctx.status = 201;
      ctx.body = task;
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { message: error.message };
    }
  }

  static async retrieveTask(ctx: Context) {
    try {
      const task: Task = await TaskService.retrieveTask(ctx.params.id);
      ctx.body = task;
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'Task not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }

  static async updateTask(ctx: Context) {
    try {
      const task: Task = await TaskService.updateTask(
        ctx.params.id,
        ctx.request.body as Partial<Task>
      );
      ctx.body = task;
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'Task not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }

  static async deleteTask(ctx: Context) {
    try {
      await TaskService.deleteTask(ctx.params.id);
      ctx.body = { message: 'Task deleted successfully' };
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'Task not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }

  static async completeTask(ctx: Context) {
    try {
      const taskId = ctx.params.id;
      const task: Task = await TaskService.completeTask(taskId);
      ctx.body = task;
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'Task not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }
}

const taskRouter: Router = new Router({ prefix: '/api/tasks' });
taskRouter.post('/create', TaskController.createTask);
taskRouter.get('/task/:id', TaskController.retrieveTask);
taskRouter.put('/task/:id', TaskController.updateTask);
taskRouter.delete('/task/:id', TaskController.deleteTask);
taskRouter.patch('/task/:id/complete', TaskController.completeTask);

export default taskRouter;
