import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';

import { randomBytes } from 'crypto';
import { accessTokenLife, refreshTokenLife } from '../constants/users.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + accessTokenLife),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenLife),
  };
};

export const registerUser = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  //10 це сіль, тобто без цього ще теоретично можна розхешувати.це набір випадкових даних

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is invalid');
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw createHttpError(401, 'Email or password is invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
  // const user = await UserCollection.findOne({ email: payload.email });
  // if (!user) throw createHttpError(404, 'User is not found!');
  // const isEqual = await bcrypt.compare(payload.password, user.password);
  // if (!isEqual) {
  //   throw createHttpError(401, 'Unauthorized');
  // }
  // await SessionCollection.deleteOne({ userId: user._id });
  // const accessToken = randomBytes(30).toString('base64');
  // const refreshToken = randomBytes(30).toString('base64');
  // return await SessionCollection.create({
  //   userId: user._id,
  //   accessToken,
  //   refreshToken,
  //   accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
  //   refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  // });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session is not found');
  }

  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Token is expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User is not found');
  }
};

export const logoutUser = (sessionId) =>
  SessionCollection.deleteOne({ _id: sessionId });

export const findSession = (filter) => SessionCollection.findOne(filter);

export const findUser = (filter) => UserCollection.findOne(filter);
