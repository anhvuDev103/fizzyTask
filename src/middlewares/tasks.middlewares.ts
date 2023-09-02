import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';
import APP_MESSAGES from '~/constants/messages';
import { getStringSchema, validate } from '~/utils/validate';

export const createTaskValidator = validate(
  checkSchema({
    title: getStringSchema('Title task', {
      isLength: false,
    }),
    user_id: {
      ...getStringSchema('UserID', {
        isLength: false,
      }),
      custom: {
        options: (value: string) => {
          if (!ObjectId.isValid(value)) {
            throw new Error(APP_MESSAGES.INVALID_ID);
          }
          return true;
        },
      },
    },
  }),
);
