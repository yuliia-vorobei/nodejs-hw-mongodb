export const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isContactType(type)) return type;
};

export const parseIsFavourite = (favourite) => {
  const isString = typeof favourite === 'string';
  if (!isString) return;
  const isFavourite = (favourite) => ['true', 'false'].includes(favourite);
  if (isFavourite(favourite)) return favourite;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
