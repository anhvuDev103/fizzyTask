import { ObjectId } from 'mongodb';
import databaseServices from './database.services';
import { CreateTaskRequestBody, UpdateTaskRequestBody } from '~/models/requests/tasks.requests';
import Task from '~/models/database/schemas/task.schema';

class TaskService {
  async getTasks(userId: string) {
    const result = await databaseServices.tasks.find({ user_id: new ObjectId(userId) }).toArray();

    return result;
  }

  async createTask(userId: string, payload: CreateTaskRequestBody) {
    await databaseServices.tasks.insertOne(new Task({ ...payload, user_id: new ObjectId(userId) }));
  }

  async updateTask(taskId: string, payload: UpdateTaskRequestBody) {
    const result = await databaseServices.tasks.findOneAndUpdate(
      {
        _id: new ObjectId(taskId),
      },
      {
        $set: {
          ...payload,
        },
        $currentDate: {
          updated_at: true,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    return result;
  }
}

export default new TaskService();
