import createHttpError from 'http-errors';
import { findSession } from '../services/auth.js';
import UserCollection from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header is missing'));
  }
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer') {
    return next(
      createHttpError(401, 'Authorization header must be type Bearer'),
    );
  }

  const session = await findSession({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Session is not found'));
  }
  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // const user = await findUser({ _id: session.userId });
  // if (!user) {
  //   return next(createHttpError(401, 'User is not found'));
  // }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    return next(createHttpError(401));
  }
  req.user = user;
  next();
};
