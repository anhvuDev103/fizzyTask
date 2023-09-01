import { checkSchema } from 'express-validator';
import { ParamSchema } from 'express-validator/src/middlewares/schema';
import APP_MESSAGES from '~/constants/messages';
import { EMAIL_REGEX } from '~/constants/regexs';
import { ErrorWithStatus } from '~/models/errors';
import { RegisterRequestBody } from '~/models/requests/users.requests';
import usersServices from '~/services/users.services';

import { isEmail, validate } from '~/utils/validate';

interface StringSchemaOptions {
  notEmpty?: boolean;
  isString?: boolean;
  isLength?: boolean | [number, number];
  trim?: boolean;
  isPassword?: boolean;
}

function getStringSchema(field: string, options?: StringSchemaOptions): ParamSchema {
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
}

export const registerValidator = validate(
  checkSchema(
    {
      fullname: getStringSchema('fullname'),
      password: getStringSchema('password', { isPassword: true }),
      confirm_password: {
        ...getStringSchema('confirm_password', { isPassword: true }),
        custom: {
          options: (value: string, { req }) => {
            return value === (req.body as RegisterRequestBody).password;
          },
          errorMessage: 'password and confirm_password does not match',
        },
      },
      email: {
        ...getStringSchema('email', { isLength: false }),
        isEmail: {
          errorMessage: 'email is invalid',
        },
        custom: {
          options: async (value: string) => {
            const isEmailExisted = await usersServices.checkEmailExisted(value);

            if (isEmailExisted) {
              throw new Error(APP_MESSAGES.EMAIL_ALREADY_EXISTED);
            }

            return true;
          },
        },
      },
    },
    ['body'],
  ),
);
