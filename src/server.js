import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express(); // веб сервер
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );
  app.use(cors());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  }); // інфа про запит і відповідь - логування (pino http)

  // app.use(logger);

  app.use(contactsRouter);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  const PORT = Number(env('PORT', 3002));
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // запуск сервера
};
