import { ObjectId } from 'mongodb';
import databaseServices from './database.services';
import { CreateTaskReqBody } from '~/models/requests/tasks.requests';
import Task from '~/models/database/schemas/task.schema';

class TaskService {
  async getTaskByUserId(userId: string) {
    const result = await databaseServices.tasks.find({
      _id: new ObjectId(userId),
    });

    return result;
  }

  async createTask(payload: CreateTaskReqBody) {
    await databaseServices.tasks.insertOne(new Task({ ...payload, user_id: new ObjectId(payload.user_id) }));
  }
}

export default new TaskService();
