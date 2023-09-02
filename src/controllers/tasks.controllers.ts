import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import APP_MESSAGES from '~/constants/messages';

import { CreateTaskReqBody, GetTasksByUserIdRequestParams } from '~/models/requests/tasks.requests';
import tasksServices from '~/services/tasks.services';

export const getTasksByUserIdController = async (req: Request<GetTasksByUserIdRequestParams>, res: Response) => {
  const { userId } = req.params;

  const result = await tasksServices.getTaskByUserId(userId);

  res.json(result);
};

export const createTaskController = async (req: Request<ParamsDictionary, any, CreateTaskReqBody>, res: Response) => {
  await tasksServices.createTask(req.body);

  res.json({
    message: APP_MESSAGES.CREATE_TASK_SUCCESS,
  });
};
