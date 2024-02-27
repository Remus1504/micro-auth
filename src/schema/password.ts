import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Please provide a valid email',
    'string.required': 'Email is a required field',
    'string.email': 'Please enter a valid email address',
  }),
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(12).messages({
    'string.base': 'Password must be a valid string',
    'string.min': 'Password should have a minimum length of 4 characters',
    'string.max': 'Password should have a maximum length of 12 characters',
    'string.empty': 'Please provide a password',
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords should match',
    'any.required': 'Confirm password is a required field',
  }),
});

const changePasswordSchema: ObjectSchema = Joi.object().keys({
  currentPassword: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be a valid string',
    'string.min': 'Password should have a minimum length of 4 characters',
    'string.max': 'Password should have a maximum length of 8 characters',
    'string.empty': 'Please provide the current password',
  }),
  newPassword: Joi.string().required().min(4).max(12).messages({
    'string.base': 'Password must be a valid string',
    'string.min': 'Password should have a minimum length of 4 characters',
    'string.max': 'Password should have a maximum length of 12 characters',
    'string.empty': 'Please provide a new password',
  }),
});

export { emailSchema, passwordSchema, changePasswordSchema };
