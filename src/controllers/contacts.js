import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/Contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseFilterParams(req.query);
  const { _id: userId } = req.user;
  filter.userId = userId;
  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  //req.params зберігаються динамічні дані
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(404, 'Contact not found');
  }
  const data = await contactServices.getContactById(contactId, userId);
  if (!data) {
    return next(createHttpError(404, 'Contact not found'));
  }
  // if (!data) {
  //   res.status(404).json({
  //     message: 'Contact not found',
  //   });
  //   return;
  // }

  //   if (!data) {
  //     next(new Error('Contact not found'));
  //     return; //після виклику next обов’язково потрібно додати return, щоб у разі помилки припинити виконання подальшого коду у контролер
  //   }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const createContactController = async (req, res) => {
  // const { _id: userId } = req.user;
  const data = await contactServices.createContact({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.updateContact(req.body, contactId, userId);

  if (!data) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId: _id } = req.params;
  const contact = await contactServices.deleteContact({ _id });
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).send();
};
