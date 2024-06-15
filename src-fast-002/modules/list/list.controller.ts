import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import ListService from './list.service';
import { List, NewList } from '../interfaces';

class ListController {
  static createList(req: FastifyRequest<{ Body: NewList }>, res: FastifyReply) {
    try {
      const list = ListService.createList(req.body);
      res.code(201).send(list);
    } catch (error: any) {
      res.code(500).send({ message: error.message });
    }
  }

  static retrieveList(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      const list = ListService.retrieveList(req.params.id);
      res.send(list);
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'List not found' });
      else res.code(500).send({ message: error.message });
    }
  }

  static updateList(
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<List> }>,
    res: FastifyReply
  ) {
    try {
      const list = ListService.updateList(req.params.id, req.body);
      res.send(list);
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'List not found' });
      else res.code(500).send({ message: error.message });
    }
  }

  static deleteList(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      ListService.deleteList(req.params.id);
      res.send({ message: 'List deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'List not found' });
      else res.code(500).send({ message: error.message });
    }
  }
}

async function listRouter(fastify: FastifyInstance) {
  fastify.post('/create', ListController.createList);
  fastify.get('/list/:id', ListController.retrieveList);
  fastify.put('/list/:id', ListController.updateList);
  fastify.delete('/list/:id', ListController.deleteList);
}

export default listRouter;
