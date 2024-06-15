import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import UserService from './user.service';
import { MaskedUser, NewUser, User } from '../interfaces';

class UserController {
  static createUser(req: FastifyRequest<{ Body: NewUser }>, res: FastifyReply) {
    try {
      const user = UserService.createUser(req.body);
      res.code(201).send(user);
    } catch (error: any) {
      res.code(500).send({ message: error.message });
    }
  }

  static retrieveUser(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      const user = UserService.retrieveUser(req.params.id);
      res.send(user);
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'User not found' });
      else res.code(500).send({ message: error.message });
    }
  }

  static updateUser(
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<User> }>,
    res: FastifyReply
  ) {
    try {
      const user = UserService.updateUser(req.params.id, req.body);
      res.send(user);
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'User not found' });
      else res.code(500).send({ message: error.message });
    }
  }

  static deleteUser(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      UserService.deleteUser(req.params.id);
      res.send({ message: 'User deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'User not found' });
      else res.code(500).send({ message: error.message });
    }
  }
}

async function userRouter(fastify: FastifyInstance) {
  fastify.post('/users/register', UserController.createUser);
  fastify.get('/users/user/:id', UserController.retrieveUser);
  fastify.put('/users/user/:id', UserController.updateUser);
  fastify.delete('/users/user/:id', UserController.deleteUser);
}

export default userRouter;
