import { ObjectId } from 'mongodb';

interface RefreshTokenType {
  _id?: ObjectId;
  token: string;
  created_at?: Date;
  user_id: ObjectId;
}

class RefreshToken {
  _id: ObjectId;
  token: string;
  created_at: Date;
  user_id: ObjectId;

  constructor(payload: RefreshTokenType) {
    this._id = payload._id || new ObjectId();
    this.token = payload.token;
    this.created_at = payload.created_at || new Date();
    this.user_id = payload.user_id;
  }
}

export default RefreshToken;
