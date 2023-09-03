import { NextFunction, Request, Response } from 'express';
import { pick } from 'lodash';

type ValidKeys<T> = Array<keyof T>;

export const filterMiddleware = <T>(validKeys: ValidKeys<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, validKeys);
    next();
  };
};
