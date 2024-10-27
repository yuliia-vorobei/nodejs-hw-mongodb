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

  app.get('/contacts', async (req, res) => {
    const data = await contactServices.getContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    //req.params зберігаються динамічні дані
    const { contactId } = req.params;
    const data = await contactServices.getContactById(contactId);
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data,
    });

    if (!data) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
  });

  app.use((req, res) => {
    // лише статус 200 є автом, всі інші треба вказувати
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = Number(env('PORT', 3002));
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // запуск сервера
};
