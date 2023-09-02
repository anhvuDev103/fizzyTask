import { checkSchema } from 'express-validator';
import { ParamSchema } from 'express-validator/src/middlewares/schema';

import { HTTP_STATUS } from '~/constants/http';
import APP_MESSAGES from '~/constants/messages';
import { ErrorWithStatus } from '~/models/errors';
import { RegisterRequestBody } from '~/models/requests/users.requests';
import databaseServices from '~/services/database.services';
import usersServices from '~/services/users.services';
import { verifyToken } from '~/utils/jwt';
import { getStringSchema, validate } from '~/utils/validate';

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

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...getStringSchema('email', { isLength: false }),
        isEmail: {
          errorMessage: 'email is invalid',
        },
      },
      password: getStringSchema('password', { isPassword: true }),
    },
    ['body'],
  ),
);
