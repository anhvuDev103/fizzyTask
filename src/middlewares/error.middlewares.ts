import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';

import { HTTP_STATUS } from '~/constants/http';
import { ErrorWithStatus } from '~/models/errors';

const defaultErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (error instanceof ErrorWithStatus) {
      return res.status(error.status).json(omit(error, 'status'));
    }

    const finalError: any = {};
    Object.getOwnPropertyNames(error).forEach((key) => {
      if (
        !Object.getOwnPropertyDescriptor(error, key)?.configurable ||
        !Object.getOwnPropertyDescriptor(error, key)?.writable
      ) {
        return;
      }
      finalError[key] = error[key];
    });

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: finalError.message,
      errorInfo: omit(error, 'stack'),
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      errorInfo: omit(error as any, 'stack'),
    });
  }
};

export default defaultErrorHandler;
