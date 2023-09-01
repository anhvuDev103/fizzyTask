import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import APP_MESSAGES from '~/constants/messages';

import { RegisterRequestBody } from '~/models/requests/users.requests';
import usersServices from '~/services/users.services';

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersServices.register(req.body);

  return res.json({
    message: APP_MESSAGES.REGISTER_SUCCESS,
    result,
  });
};
