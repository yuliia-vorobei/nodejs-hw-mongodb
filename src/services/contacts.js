import ContactCollection from '../db/models/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const contactsQuery = ContactCollection.find();

  // .skip(skip)
  // .limit(perPage)
  // .sort({ [sortBy]: sortOrder });

  if (filter.contactType) {
    contactsQuery.where('contactType').in(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').in(filter.isFavourite);
  }

  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }
  const totalItems = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const skip = (page - 1) * perPage;
  const data = await contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  // //skip пропускає в запиті перших 2, а ліміт віддає 10
  // const totalItems = await ContactCollection.find()
  //   .merge(contactsQuery)
  //   .countDocuments(); // повертає к-сть елементів

  const paginationData = calculatePaginationData({
    totalItems,
    page,
    perPage,
  });
  return {
    data,
    ...paginationData,
  };
};

export const getContactById = async (contactID, userId) => {
  const contact = await ContactCollection.findOne({ _id: contactID, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (
  contactID,
  userId,
  payload,
  options = {},
) => {
  const data = await ContactCollection.findOneAndUpdate(
    { _id: contactID, userId },
    payload,
    {
      new: true,
      ...options,
      // includeResultMetadata: true,
      // для того щоб монгус надсилав оновлені дані в респонсі (лише оновлюються в базі)
      //upsert: true, - для put на оновлення якщо немає таких даних по id
    },
  );

  //findOneAndUpdate({ _id }, payload, - id це обєкт який відправляємо для патч по чому саме змінюємо

  return data;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await ContactCollection.findOneAndDelete({
    _id: contactId,
  });
  return deletedContact;
};
