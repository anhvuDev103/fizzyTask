import { SignOptions } from 'jsonwebtoken';
import { TokenType } from '~/constants/enums';
import { RequiredPick } from '~/utils/types';

interface Payload {
  user_id: string;
  type: TokenType;
}

interface TokenContructorParams {
  payload: Payload;
  secretOrPrivateKey: string;
  option: RequiredPick<SignOptions, 'expiresIn'>;
}

class Token {
  payload: Payload;
  secretOrPrivateKey: string;
  option: SignOptions;

  constructor(_payload: TokenContructorParams) {
    this.payload = _payload.payload;
    this.secretOrPrivateKey = _payload.secretOrPrivateKey;
    this.option = _payload.option;
  }
}

export default Token;
