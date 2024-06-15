import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';

// INTERFACES
interface Database {
  lastUserId: string;
  lastListId: string;
  lastTaskId: string;
  users: User[];
  lists: List[];
  tasks: Task[];
}
interface User {
  userId: string;
  username: string;
  password: string;
  fullname: string;
}
interface List {
  listId: string;
  listName: string;
  isShared: boolean;
}
interface Task {
  taskId: string;
  listId: string;
  userId: string;
  taskName: string;
  isComplete: boolean;
}
interface NewUser extends Omit<User, 'userId'> {}
interface MaskedUser extends Omit<User, 'password'> {}
interface NewList extends Omit<List, 'listId'> {}
interface NewTask extends Omit<Task, 'taskId'> {}
// CONTROLLERS
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

// SERVICES
class UserService {
  static createUser(userData: NewUser): MaskedUser {
    const data: Database = DatabaseService.getData();
    const nextUserId: string = `U${1 + Number(data.lastUserId.slice(1))}`;
    const user: User = { userId: nextUserId, ...userData };

    data.users.push(user);
    data.lastUserId = nextUserId;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static retrieveUser(userId: string): MaskedUser | undefined {
    const data: Database = DatabaseService.getData();
    const user: User | undefined = data.users.find((user: User) => user.userId === userId);

    if (!user) throw new Error('Not Found');
    else {
      const { password, ...maskedUser } = user;
      return maskedUser;
    }
  }

  static updateUser(userId: string, userData: Partial<User>): MaskedUser {
    const data: Database = DatabaseService.getData();
    const userIndex: number = data.users.findIndex((user: User) => user.userId === userId);
    if (userIndex === -1) throw new Error('Not Found');
    const user: User = { ...data.users[userIndex], ...userData };

    data.users[userIndex] = user;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static deleteUser(userId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.users.length;

    data.users = data.users.filter((user: User) => user.userId !== userId);
    if (totalRecords === data.users.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}
class TaskService {
  static createTask(taskData: NewTask): Task {
    const data: Database = DatabaseService.getData();
    const nextTaskId: string = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const task: Task = { taskId: nextTaskId, ...taskData };

    data.tasks.push(task);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(data);

    return task;
  }

  static retrieveTask(taskId: string): Task | undefined {
    const data: Database = DatabaseService.getData();

    const task: Task | undefined = data.tasks.find((task: Task) => task.taskId === taskId);
    if (!task) throw new Error('Not Found');
    else return task;
  }

  static updateTask(taskId: string, taskData: Partial<Task>): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: any) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Not Found');
    const task: Task = { ...data.tasks[taskIndex], ...taskData };

    data.tasks[taskIndex] = task;
    DatabaseService.setData(data);

    return task;
  }

  static deleteTask(taskId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.tasks.length;

    data.tasks = data.tasks.filter((task: Task) => task.taskId !== taskId);
    if (totalRecords === data.tasks.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }

  static completeTask(taskId: string): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: Task) => task.taskId === taskId);

    if (taskIndex === -1) throw new Error('Not Found');
    else {
      data.tasks[taskIndex].isComplete = true;
      DatabaseService.setData(data);
      return data.tasks[taskIndex];
    }
  }
}
class ListService {
  static createList(listData: NewList): List {
    const data: Database = DatabaseService.getData();
    const nextListId: string = `L${1 + Number(data.lastListId.slice(1))}`;
    const list: List = { listId: nextListId, ...listData };

    data.lists.push(list);
    data.lastListId = nextListId;
    DatabaseService.setData(data);

    return list;
  }

  static retrieveList(listId: string): List | undefined {
    const data: Database = DatabaseService.getData();

    const list: List | undefined = data.lists.find((list: List) => list.listId === listId);
    if (!list) throw new Error('Not Found');
    else return list;
  }

  static updateList(listId: string, listData: Partial<List>): List {
    const data: Database = DatabaseService.getData();
    const listIndex: number = data.lists.findIndex((list: any) => list.listId === listId);
    if (listIndex === -1) throw new Error('Not Found');
    const list: List = { ...data.lists[listIndex], ...listData };

    data.lists[listIndex] = list;
    DatabaseService.setData(data);

    return list;
  }

  static deleteList(listId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.lists.length;

    data.lists = data.lists.filter((list: List) => list.listId !== listId);
    if (totalRecords === data.lists.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}

class DatabaseService {
  private static db: Database;
  private static filePath = path.join(__dirname, './db.json');

  static init(): void {
    this.db = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  static getData(): Database {
    return this.db;
  }

  static setData(data: Database): void {
    this.db = data;
  }

  static saveToDisk(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.db), 'utf8');
  }
}

// DATABASE
DatabaseService.init();

// ROUTER
const app: FastifyInstance = fastify();

// MIDDLEWARE
const pre = '/api';

// ROUTES
app.post(pre + '/users/register', UserController.createUser);
app.get(pre + '/users/user/:id', UserController.retrieveUser);
app.put(pre + '/users/user/:id', UserController.updateUser);
app.delete(pre + '/users/user/:id', UserController.deleteUser);
app.post(pre + '/tasks/create', TaskController.createTask);
app.get(pre + '/tasks/task/:id', TaskController.retrieveTask);
app.put(pre + '/tasks/task/:id', TaskController.updateTask);
app.delete(pre + '/tasks/task/:id', TaskController.deleteTask);
app.patch(pre + '/tasks/task/:id/complete', TaskController.completeTask);
app.post(pre + '/lists/create', ListController.createList);
app.get(pre + '/lists/list/:id', ListController.retrieveList);
app.put(pre + '/lists/list/:id', ListController.updateList);
app.delete(pre + '/lists/list/:id', ListController.deleteList);
app.get(pre, (req, res) => res.send('Hello World!'));

// SERVER
const PORT = 3000;
app.listen({ port: PORT, host: '127.0.0.1' }, (err, address) => {
  if (err) throw err;
  console.log(`Server is running on ${address}`);
});
