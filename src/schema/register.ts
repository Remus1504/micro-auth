import Joi, { ObjectSchema } from 'joi';

const newRegisterSchema: ObjectSchema = Joi.object().keys({
  newUsername: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Invalid username',
    'string.max': 'Invalid username',
    'string.empty': 'Username is a required field',
  }),
  newPassword: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field',
  }),
  newCountry: Joi.string().required().messages({
    'string.base': 'Country must be of type string',
    'string.empty': 'Country is a required field',
  }),
  newEmail: Joi.string().email().required().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Invalid email',
    'string.empty': 'Email is a required field',
  }),
  newProfilePicture: Joi.string().required().messages({
    'string.base': 'Please add a profile picture',
    'string.email': 'Profile picture is required',
    'string.empty': 'Profile picture is required',
  }),
});

export { newRegisterSchema };
