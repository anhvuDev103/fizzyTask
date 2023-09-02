import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

interface SignTokenParams {
  payload: string | object | Buffer;
  secretOrPrivateKey: Secret;
  options?: SignOptions;
}

interface VerifyTokenParams {
  token: string;
  secretOrPublicKey: Secret;
}

export const signToken = ({ payload, secretOrPrivateKey, options = { algorithm: 'HS256' } }: SignTokenParams) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (error, encoded) => {
      if (error) {
        throw reject(error);
      }

      resolve(encoded!);
    });
  });
};

export const verifyToken = ({ token, secretOrPublicKey }: VerifyTokenParams) => {
  return new Promise<string | JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error);
      }

      resolve(decoded!);
    });
  });
};
