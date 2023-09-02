import { Router } from 'express';

import { createTaskController, getTasksByUserIdController } from '~/controllers/tasks.controllers';
import { createTaskValidator } from '~/middlewares/tasks.middlewares';
import { accessTokenValidator } from '~/middlewares/tokens.middlewares';

const taskRouter = Router();

/**
 * DESCRIPTION: Get all tasks
 * PATH: /:userId
 * METHOD: GET
 * BODY: { email: string, password: string }
 * HEADERS: { Authorization: Bearer <access_token> }
 */
taskRouter.get('/:userId', accessTokenValidator, getTasksByUserIdController);

/**
 * DESCRIPTION: Create a task
 * PATH: /
 * METHOD: POST
 * BODY: { email: string, password: string }
 * HEADERS: { Authorization: Bearer <access_token> }
 */
taskRouter.post('/', accessTokenValidator, createTaskValidator, createTaskController);

export default taskRouter;
