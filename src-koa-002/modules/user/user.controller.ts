import Router from '@koa/router';
import { Context } from 'koa';
import UserService from './user.service';
import { MaskedUser, NewUser, User } from '../interfaces';

class UserController {
  static createUser(ctx: Context): void {
    try {
      const user: MaskedUser = UserService.createUser(ctx.request.body as NewUser);
      ctx.status = 201;
      ctx.body = user;
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { message: error.message };
    }
  }

  static retrieveUser(ctx: Context): void {
    try {
      const user: MaskedUser = UserService.retrieveUser(ctx.params.id);
      ctx.body = user;
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }

  static updateUser(ctx: Context): void {
    try {
      const user: MaskedUser = UserService.updateUser(
        ctx.params.id,
        ctx.request.body as Partial<User>
      );
      ctx.body = user;
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }

  static deleteUser(ctx: Context): void {
    try {
      UserService.deleteUser(ctx.params.id);
      ctx.body = { message: 'User deleted successfully' };
    } catch (error: any) {
      if (error.message === 'Not Found') {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
      } else {
        ctx.status = 500;
        ctx.body = { message: error.message };
      }
    }
  }
}

const userRouter: Router = new Router({ prefix: '/api/users' });
userRouter.post('/register', UserController.createUser);
userRouter.get('/user/:id', UserController.retrieveUser);
userRouter.put('/user/:id', UserController.updateUser);
userRouter.delete('/user/:id', UserController.deleteUser);

export default userRouter;
