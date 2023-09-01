import { HTTP_STATUS } from '~/constants/http';
import APP_MESSAGES from '~/constants/messages';

type Errors = Record<
  string,
  {
    msg: string;
    [key: string]: any;
  }
>;

interface ErrorContructorParams {
  message: string;
  status?: number;
}

interface EnityErrorContructorParams {
  message?: string;
  errors: Errors;
}

export class ErrorWithStatus {
  message: string;
  status: number;

  constructor({ message, status }: ErrorContructorParams) {
    this.message = message;
    this.status = status ?? HTTP_STATUS.BAD_REQUEST;
  }
}

export class EntityError extends ErrorWithStatus {
  errors: Errors;

  constructor({ message = APP_MESSAGES.VALIDATION_ERROR, errors }: EnityErrorContructorParams) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY });
    this.errors = errors;
  }
}
