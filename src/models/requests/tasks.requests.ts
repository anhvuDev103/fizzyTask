import { ParamsDictionary } from 'express-serve-static-core';
import Task from '../database/schemas/task.schema';
import { WithRequired } from '~/utils/types';

export interface CreateTaskRequestBody
  extends WithRequired<Partial<Pick<Task, 'title' | 'description' | 'due_date' | 'tag_ids' | 'project_id'>>, 'title'> {}

export interface UpdateTaskRequestBody
  extends Partial<Pick<Task, 'title' | 'description' | 'due_date' | 'tag_ids' | 'project_id'>> {}

export interface UpdateTaskReqParams extends ParamsDictionary {
  taskId: string;
}
