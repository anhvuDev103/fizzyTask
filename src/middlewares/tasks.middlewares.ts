import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';
import { HTTP_STATUS } from '~/constants/http';
import APP_MESSAGES from '~/constants/messages';
import { ErrorWithStatus } from '~/models/errors';
import databaseServices from '~/services/database.services';
import { getISOStringDateSchema, getStringSchema, isValidObjectId, validate } from '~/utils/validate';

// export const createTaskValidator = validate(
//   checkSchema(
//     {
//       title: getStringSchema('Title task', {
//         isLength: false,
//       }),
//       description: {
//         ...getStringSchema('Title task', {
//           isLength: false,
//           notEmpty: false,
//         }),
//         optional: true,
//       },
//       due_date: {
//         ...getISOStringDateSchema(),
//         optional: true,
//       },
//     },
//     ['body'],
//   ),
// );

// export const updateTaskValidator = validate(
//   checkSchema(
//     {
//       title: getStringSchema('Title task', {
//         isLength: false,
//       }),
//       description: {
//         ...getStringSchema('Title task', {
//           isLength: false,
//           notEmpty: false,
//         }),
//         optional: true,
//       },
//       due_date: {
//         ...getISOStringDateSchema(),
//         optional: true,
//       },
//       // tag_ids?: ObjectId[];
//       // project_id?: ObjectId | null;
//     },
//     ['body'],
//   ),
// );

export const taskRequestValidator = validate(
  checkSchema(
    {
      title: {
        ...getStringSchema('Title task', {
          isLength: false,
        }),
        optional: true,
      },
      description: {
        ...getStringSchema('Title task', {
          isLength: false,
          notEmpty: false,
        }),
        optional: true,
      },
      due_date: {
        ...getISOStringDateSchema(),
        optional: true,
      },
      tag_ids: {
        isArray: true,
        custom: {
          options: async (value: string[]) => {
            if (value.some((item) => !isValidObjectId(item))) {
              throw new Error(APP_MESSAGES.INVALID_ID);
            }
          },
        },
        optional: true,
      },
      project_id: {
        custom: {
          options: async (value: string) => {
            if (!isValidObjectId(value)) {
              throw new Error(APP_MESSAGES.INVALID_ID);
            }
          },
        },
        optional: true,
      },
    },
    ['body'],
  ),
);

export const taskIdValidator = validate(
  checkSchema(
    {
      task_id: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new Error(APP_MESSAGES.TASK_ID_IS_REQUIRED);
            }

            if (!isValidObjectId(value)) {
              throw new Error(APP_MESSAGES.INVALID_ID);
            }

            const task = await databaseServices.tasks.findOne({
              _id: new ObjectId(value),
            });

            if (!task) {
              throw new ErrorWithStatus({
                message: APP_MESSAGES.TASK_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND,
              });
            }
            req.task = task;
            return true;
          },
        },
      },
    },
    ['body', 'params'],
  ),
);
