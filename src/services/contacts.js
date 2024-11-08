import ContactCollection from '../db/models/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactCollection.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  if (filter.contactType) {
    contactsQuery.where('contactType').in(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').in(filter.isFavourite);
  }

  const data = await contactsQuery;

  //skip пропускає в запиті перших 2, а ліміт віддає 10
  const totalItems = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments(); // повертає к-сть елементів
  const paginationData = calculatePaginationData({ totalItems, page, perPage });
  return {
    data,
    ...paginationData,
  };
};

export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);

export const createContact = async (payload) => {
  const contact = ContactCollection.create(payload);
  return contact;
};

export const updateContact = async ({ _id, payload, options = {} }) => {
  const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    ...options,
    new: true,
    // includeResultMetadata: true,
    // для того щоб монгус надсилав оновлені дані в респонсі (лише оновлюються в базі)
    //upsert: true, - для put на оновлення якщо немає таких даних по id
  });
  return rawResult;
  //findOneAndUpdate({ _id }, payload, - id це обєкт який відправляємо для патч по чому саме змінюємо
  // if (!rawResult || !rawResult.value) return null;

  // return {
  //   data: rawResult.value,
  //   isNew: Boolean(rawResult.lastErrorObject.upserted),
  // };
};

export const deleteContact = async (filter) => {
  const deletedContact = await ContactCollection.findOneAndDelete(filter);
  return deletedContact;
};
