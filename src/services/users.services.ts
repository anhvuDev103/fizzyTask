import { LoginRequestBody, LogoutRequestBody, RegisterRequestBody } from '~/models/requests/users.requests';
import databaseServices from './database.services';
import User from '~/models/database/schemas/user.schemas';
import { hash } from '~/utils/crypto';
import { signToken } from '~/utils/jwt';
import { TokenType } from '~/constants/enums';
import Token from '~/models/token';
import { ErrorWithStatus } from '~/models/errors';
import APP_MESSAGES from '~/constants/messages';
import { HTTP_STATUS } from '~/constants/http';
import RefreshToken from '~/models/database/schemas/refreshToken.schema';
import { ObjectId } from 'mongodb';

class UserService {
  private signAccessToken(userId: string) {
    console.log('>> Check | process.env.JWT_EXPIRES_IN_ACCESS_TOKEN:', process.env.JWT_EXPIRES_IN_ACCESS_TOKEN);
    return signToken(
      new Token({
        payload: {
          type: TokenType.AccessToken,
          user_id: userId,
        },
        secretOrPrivateKey: process.env.JWT_SECRET_ACCESS_TOKEN!,
        options: {
          expiresIn: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN!,
        },
      }),
    );
  }

  private signRefreshToken(userId: string) {
    return signToken(
      new Token({
        payload: {
          type: TokenType.RefreshToken,
          user_id: userId,
        },
        secretOrPrivateKey: process.env.JWT_SECRET_REFRESH_TOKEN!,
        options: {
          expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN!,
        },
      }),
    );
  }

  private signTokenAndRefreshToken(userId: string): Promise<[signedAccessToken: string, signedRefreshToken: string]> {
    return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)]);
  }

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

  async login(payload: LoginRequestBody) {
    const user = await databaseServices.users.findOne(
      {
        ...payload,
        password: hash(payload.password),
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0,
        },
      },
    );

    if (!user) {
      throw new ErrorWithStatus({
        message: APP_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    const userId = user._id;

    const [signedAccessToken, signedRefreshToken] = await this.signTokenAndRefreshToken(userId.toString());

    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        token: signedRefreshToken,
        user_id: userId,
      }),
    );

    return {
      access_token: signedAccessToken,
      refresh_token: signedRefreshToken,
    };
  }

  async logout(payload: LogoutRequestBody) {
    const { refresh_token } = payload;

    await databaseServices.refreshTokens.deleteOne({
      token: refresh_token,
    });
  }
}

export default new UserService();
