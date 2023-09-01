import { RegisterRequestBody } from '~/models/requests/users.requests';
import databaseServices from './database.services';
import User from '~/models/database/schemas/users.schemas';
import { hash } from '~/utils/crypto';

class UserService {
  async checkEmailExisted(email: string) {
    return Boolean(await databaseServices.users.findOne({ email }));
  }

  async register(payload: Omit<RegisterRequestBody, 'confirm_password'>) {
    return await databaseServices.users.insertOne(
      new User({
        ...payload,
        password: hash(payload.password),
      }),
    );
  }
}

export default new UserService();
