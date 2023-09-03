import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { ParamSchema, RunnableValidationChains } from 'express-validator/src/middlewares/schema';
import { ObjectId } from 'mongodb';

import { HTTP_STATUS } from '~/constants/http';
import APP_MESSAGES from '~/constants/messages';
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

interface StringSchemaOptions {
  notEmpty?: boolean;
  isString?: boolean;
  isLength?: boolean | [number, number];
  trim?: boolean;
  isPassword?: boolean;
}

export const getStringSchema = (field: string, options?: StringSchemaOptions): ParamSchema => {
  const { notEmpty = true, isString = true, isLength = [5, 25], trim = true, isPassword = false } = options || {};
  return {
    notEmpty: notEmpty && {
      errorMessage: `${field} is required`,
    },
    isString: isString && {
      errorMessage: `${field} must be a string`,
    },
    isLength: isLength &&
      typeof isLength !== 'boolean' && {
        options: {
          min: isLength[0],
          max: isLength[1],
        },
        errorMessage: `${field} length must be from ${isLength[0]} to ${isLength[1]}`,
      },
    isStrongPassword: isPassword && {
      errorMessage: `${field} must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol`,
    },
    trim: trim,
  };
};

export const getISOStringDateSchema = (): ParamSchema => {
  return {
    isISO8601: {
      options: {
        strict: true,
        strictSeparator: true,
      },
      errorMessage: APP_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601,
    },
  };
};

export const isValidObjectId = (value: string): boolean => ObjectId.isValid(value);
