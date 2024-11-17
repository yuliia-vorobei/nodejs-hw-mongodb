import Joi from 'joi';
import { emailRegex } from '../constants/users.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email(emailRegex).required(),
  password: Joi.string().min(6).required(),
});
