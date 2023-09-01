import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema';
import { HTTP_STATUS } from '~/constants/http';
import { EMAIL_REGEX } from '~/constants/regexs';
import { EntityError, ErrorWithStatus } from '~/models/errors';

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req);

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorObj = errors.mapped();
    const entityErrors = new EntityError({ errors: {} });

    for (const key in errorObj) {
      const { msg } = errorObj[key];

      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        next(msg);
      }

      entityErrors.errors[key] = errorObj[key];
    }

    next(entityErrors);
  };
};

export const isEmail = (value: string): boolean => EMAIL_REGEX.test(value);
