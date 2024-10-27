import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import * as contactServices from './services/contacts.js';

export const setupServer = () => {
  const app = express(); // веб сервер
  app.use(cors());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  }); // інфа про запит і відповідь - логування (pino http)

  app.use(logger);

  app.get('/contacts', async (req, res, next) => {
    try {
      const data = await contactServices.getContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data,
      });
    } catch (err) {
      next(err);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
      //req.params зберігаються динамічні дані
      const { contactId } = req.params;
      const data = await contactServices.getContactById(contactId);

      if (!data) {
        res.status(404).json({
          message: 'Contact not found',
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data,
      });
    } catch (err) {
      next(err);
    }
  });

  app.use((req, res, next) => {
    // лише статус 200 є автом, всі інші треба вказувати
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
    });
  });

  const PORT = Number(env('PORT', 3002));
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // запуск сервера
};
