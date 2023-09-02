import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import APP_MESSAGES from '~/constants/messages';

import { LoginRequestBody, LogoutRequestBody, RegisterRequestBody } from '~/models/requests/users.requests';
import usersServices from '~/services/users.services';

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersServices.register(req.body);

  return res.json({
    message: APP_MESSAGES.REGISTER_SUCCESS,
    result,
  });
};

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const result = await usersServices.login(req.body);
  console.log('>> Check | result:', result);

  return res.json({
    message: APP_MESSAGES.LOGIN_SUCCESS,
    result,
  });
};

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  await usersServices.logout(req.body);

  return res.json({
    message: APP_MESSAGES.LOGOUT_SUCCESS,
  });
};
