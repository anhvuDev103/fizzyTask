import { Router } from 'express';

import { loginController, logoutController, registerController } from '~/controllers/users.controllers';
import { accessTokenValidator, refreshTokenValidator } from '~/middlewares/tokens.middlewares';
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares';
import { requestHandlerWrapper } from '~/utils/handlers';

const userRouter = Router();

/**
 * DESCRIPTION: Register account
 * PATH: /register
 * METHOD: POST
 * BODY: { fullname: string, email: string, password: string, confirm_password: string }
 */
userRouter.post('/register', registerValidator, requestHandlerWrapper(registerController));

/**
 * DESCRIPTION: Login account
 * PATH: /login
 * METHOD: POST
 * BODY: { email: string, password: string }
 */
userRouter.post('/login', loginValidator, requestHandlerWrapper(loginController));

/**
 * DESCRIPTION: Logout account
 * PATH: /logout
 * METHOD: POST
 * BODY: { refresh_token: string }
 * HEADERS: { Authorization: Bearer <access_token> }
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, requestHandlerWrapper(logoutController));

export default userRouter;
