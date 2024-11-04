import ContactCollection from '../db/models/Contacts.js';

export const getContacts = () => ContactCollection.find();

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
