import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import TaskService from './task.service';
import { Task, NewTask } from '../interfaces';

class TaskController {
  static createTask(req: FastifyRequest<{ Body: NewTask }>, res: FastifyReply) {
    try {
      const task = TaskService.createTask(req.body);
      res.code(201).send(task);
    } catch (error: any) {
      res.code(500).send({ message: error.message });
    }
  }

  static retrieveTask(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      const task = TaskService.retrieveTask(req.params.id);
      res.send(task);
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'Task not found' });
      else res.code(500).send({ message: error.message });
    }
  }

  static updateTask(
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<Task> }>,
    res: FastifyReply
  ) {
    try {
      const task = TaskService.updateTask(req.params.id, req.body);
      res.send(task);
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'Task not found' });
      else res.code(500).send({ message: error.message });
    }
  }

  static deleteTask(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      TaskService.deleteTask(req.params.id);
      res.send({ message: 'Task deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'Task not found' });
      else res.code(500).send({ message: error.message });
    }
  }

  static completeTask(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      const taskId = req.params.id;
      const task = TaskService.completeTask(taskId);
      res.send(task);
    } catch (error: any) {
      if (error.message === 'Not Found') res.code(404).send({ message: 'Task not found' });
      else res.code(500).send({ message: error.message });
    }
  }
}

async function taskRouter(fastify: FastifyInstance) {
  fastify.post('/tasks/create', TaskController.createTask);
  fastify.get('/tasks/task/:id', TaskController.retrieveTask);
  fastify.put('/tasks/task/:id', TaskController.updateTask);
  fastify.delete('/tasks/task/:id', TaskController.deleteTask);
  fastify.patch('/tasks/task/:id/complete', TaskController.completeTask);
}

export default taskRouter;
