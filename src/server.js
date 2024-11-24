import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express(); // веб сервер
  // app.use(
  //   express.json({
  //     type: ['application/json', 'application/vnd.api+json'],
  //   }),
  // );
  app.use(express.json());

  app.use(cors());
  app.use(cookieParser());
  app.use(express.static('uploads'));

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  }); // інфа про запит і відповідь - логування (pino http)

  // app.use(logger);

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  const PORT = Number(env('PORT', 3000));
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // запуск сервера
};
