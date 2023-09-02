import { ParamsDictionary } from 'express-serve-static-core';

export interface GetTasksByUserIdRequestParams extends ParamsDictionary {
  userId: string;
}

export interface CreateTaskReqBody {
  title: string;
  user_id: string;
}
