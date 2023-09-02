import { SignOptions } from 'jsonwebtoken';
import { TokenType } from '~/constants/enums';
import { WithRequired } from '~/utils/types';

interface Payload {
  user_id: string;
  type: TokenType;
}

interface TokenContructorParams {
  payload: Payload;
  secretOrPrivateKey: string;
  options: WithRequired<SignOptions, 'expiresIn'>;
}

class Token {
  payload: Payload;
  secretOrPrivateKey: string;
  options: SignOptions;

  constructor(_payload: TokenContructorParams) {
    this.payload = _payload.payload;
    this.secretOrPrivateKey = _payload.secretOrPrivateKey;
    this.options = _payload.options;
  }
}

export default Token;
