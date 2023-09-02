import { Request } from 'express';
import { checkSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';

import { HTTP_STATUS } from '~/constants/http';
import APP_MESSAGES from '~/constants/messages';
import { ErrorWithStatus } from '~/models/errors';
import databaseServices from '~/services/database.services';
import { verifyToken } from '~/utils/jwt';
import { validate } from '~/utils/validate';

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1];
            if (!access_token) {
              throw new ErrorWithStatus({
                message: APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }
            try {
              const decodedAccessToken = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN!,
              });

              (req as Request).decodedAccessToken = decodedAccessToken;
              return true;
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }
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

            (req as Request).decodedRefreshToken = decodedRefreshToken;
            return true;
          },
        },
      },
    },
    ['body'],
  ),
);
