import { ObjectId } from 'mongodb';

interface UserType {
  _id?: ObjectId;
  email: string;
  fullname: string;
  password: string;
  username?: string;
  email_verify_token?: string;
  forgot_password_token?: string;
  created_at?: Date;
  updated_at?: Date;
}

class User {
  _id: ObjectId;
  email: string;
  fullname: string;
  password: string;
  username: string | null;
  email_verify_token: string | null;
  forgot_password_token: string | null;
  created_at: Date;
  updated_at: Date;

  constructor(payload: UserType) {
    const now = new Date();

    this._id = payload._id || new ObjectId();
    this.email = payload.email;
    this.fullname = payload.fullname;
    this.password = payload.password;
    this.username = payload.username || null;
    this.email_verify_token = payload.email_verify_token || null;
    this.forgot_password_token = payload.forgot_password_token || null;
    this.created_at = payload.created_at || now;
    this.updated_at = payload.updated_at || now;
  }
}

export default User;
