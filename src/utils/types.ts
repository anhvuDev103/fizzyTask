import { JwtPayload } from 'jsonwebtoken';
import { TokenType } from '~/constants/enums';

export interface TokenPayload extends JwtPayload {
  user_id: string;
  type: TokenType;
  exp: number;
  iat: number;
}

export type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};
