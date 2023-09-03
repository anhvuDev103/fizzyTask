import { Router } from 'express';

import { createTaskController, getAllTasksController, updateTaskController } from '~/controllers/tasks.controllers';
import { filterMiddleware } from '~/middlewares/common.middlewares';
import { taskRequestValidator, taskIdValidator } from '~/middlewares/tasks.middlewares';
import { accessTokenValidator } from '~/middlewares/tokens.middlewares';
import { UpdateTaskRequestBody } from '~/models/requests/tasks.requests';

const taskRouter = Router();

/**
 * DESCRIPTION: Get all tasks
 * PATH: /:userId
 * METHOD: GET
 * BODY: { email: string, password: string }
 * HEADERS: { Authorization: Bearer <access_token> }
 */
taskRouter.get('/', accessTokenValidator, getAllTasksController);

/**
 * DESCRIPTION: Create a task
 * PATH: /
 * METHOD: POST
 * BODY: { email: string, password: string }
 * HEADERS: { Authorization: Bearer <access_token> }
 */
taskRouter.post('/', accessTokenValidator, taskRequestValidator, createTaskController);

/**
 * DESCRIPTION: Update a task
 * PATH: /:task_id
 * METHOD: PATCH
 * BODY: TaskSchema
 * HEADERS: { Authorization: Bearer <access_token> }
 */
taskRouter.patch(
  '/:task_id',
  accessTokenValidator,
  taskIdValidator,
  taskRequestValidator,
  filterMiddleware<UpdateTaskRequestBody>(['title', 'description', 'due_date', 'project_id', 'tag_ids']),
  updateTaskController,
);

export default taskRouter;
