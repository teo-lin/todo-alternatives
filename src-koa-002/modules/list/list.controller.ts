import Router from '@koa/router';
import { Context } from 'koa';
import ListService from './list.service';
import { List, NewList } from '../interfaces';

class ListController {
  static async createList(ctx: Context) {
    try {
      const list: List = await ListService.createList(ctx.request.body as NewList);
      ctx.status = 201;
      ctx.body = list;
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { message: error.message };
    }
  }

  static async retrieveList(ctx: Context) {
    try {
      const list: List = await ListService.retrieveList(ctx.params.id);
      ctx.body = list;
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'List not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }

  static async updateList(ctx: Context) {
    try {
      const list: List = await ListService.updateList(
        ctx.params.id,
        ctx.request.body as Partial<List>
      );
      ctx.body = list;
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'List not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }

  static async deleteList(ctx: Context) {
    try {
      await ListService.deleteList(ctx.params.id);
      ctx.body = { message: 'List deleted successfully' };
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'List not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }
}

const listRouter: Router = new Router({ prefix: '/api/lists' });
listRouter.post('/create', ListController.createList);
listRouter.get('/list/:id', ListController.retrieveList);
listRouter.put('/list/:id', ListController.updateList);
listRouter.delete('/list/:id', ListController.deleteList);

export default listRouter;
