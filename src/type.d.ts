import { Request } from 'express';
import Task from './models/database/schemas/task.schema';
import { TokenPayload } from './utils/types';

declare module 'express' {
  interface Request {
    decodedRefreshToken?: TokenPayload;
    decoded_authorization?: TokenPayload;
    task?: Task;
  }
}
