import { Router } from 'express';

import { registerController } from '~/controllers/users.controllers';
import { registerValidator } from '~/middlewares/users.middlewares';
import { requestHandlerWrapper } from '~/utils/handlers';

const userRouter = Router();

/**
 * DESCRIPTION: Register account
 * METHOD: POST
 * BODY: { fullname: string, email: string, password: string, confirm_password: string }
 */
userRouter.post('/register', registerValidator, requestHandlerWrapper(registerController));

export default userRouter;
