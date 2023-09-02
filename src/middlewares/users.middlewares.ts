import { checkSchema } from 'express-validator';
import { ParamSchema } from 'express-validator/src/middlewares/schema';
import { HTTP_STATUS } from '~/constants/http';
import APP_MESSAGES from '~/constants/messages';
import { EMAIL_REGEX } from '~/constants/regexs';
import { ErrorWithStatus } from '~/models/errors';
import { RegisterRequestBody } from '~/models/requests/users.requests';
import databaseServices from '~/services/database.services';
import usersServices from '~/services/users.services';
import { verifyToken } from '~/utils/jwt';

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

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: (value: string, { req }) => {
            console.log('>> Check | value:', value);
            return true;
          },
        },
      },
    },
    ['headers'],
  ),
);

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: APP_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }

            const [decodedRefreshToken, refreshToken] = await Promise.all([
              verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN!,
              }),
              databaseServices.refreshTokens.findOne({
                token: value,
              }),
            ]);

            if (!refreshToken) {
              throw new ErrorWithStatus({
                message: APP_MESSAGES.REFRESH_TOKEN_NOT_EXISTED,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }

            req.decodedRefreshToken = decodedRefreshToken;
          },
        },
      },
    },
    ['body'],
  ),
);
