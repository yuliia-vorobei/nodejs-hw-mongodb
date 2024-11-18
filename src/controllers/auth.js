import { accessTokenLife, refreshTokenLife } from '../constants/users.js';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetToken,
} from '../services/auth.js';

// import createHttpError from 'http-errors';
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenLife),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + accessTokenLife),
  });
};

export const registerUserController = async (req, res) => {
  const data = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const session = await refreshUserSession(req.cookies);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    message: 'Reset password email has been successfully sent!',
    status: 200,
    data: {},
  });
};
