declare namespace Express {
  interface Request {
    decodedRefreshToken?: string | JwtPayload;
    decodedAccessToken?: string | JwtPayload;
  }
}
