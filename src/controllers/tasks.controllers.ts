import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { CreateTaskRequestBody, UpdateTaskRequestBody, UpdateTaskReqParams } from '~/models/requests/tasks.requests';
import tasksServices from '~/services/tasks.services';
import { TokenPayload } from '~/utils/types';
import APP_MESSAGES from '~/constants/messages';

export const getAllTasksController = async (req: Request, res: Response) => {
  const { user_id: userId } = req.decoded_authorization as TokenPayload;

  const result = await tasksServices.getTasks(userId);

  res.json(result);
};

export const createTaskController = async (
  req: Request<ParamsDictionary, any, CreateTaskRequestBody>,
  res: Response,
) => {
  const { user_id: userId } = req.decoded_authorization as TokenPayload;

  await tasksServices.createTask(userId, req.body);

  res.json({
    message: APP_MESSAGES.CREATE_TASK_SUCCESS,
  });
};

export const updateTaskController = async (
  req: Request<UpdateTaskReqParams, any, UpdateTaskRequestBody>,
  res: Response,
) => {
  const { _id: taskId } = req.task!;

  const result = await tasksServices.updateTask(taskId.toString(), req.body);

  res.json({
    message: APP_MESSAGES.UPDATE_TASK_SUCCESS,
    result,
  });
};
