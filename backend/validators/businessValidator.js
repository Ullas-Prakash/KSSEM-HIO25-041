const Joi = require('joi');

exports.createBusinessSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zipCode: Joi.string().allow(''),
    country: Joi.string().allow(''),
  }).default({}),
  contact: Joi.object({
    phone: Joi.string().allow(''),
    email: Joi.string().email().allow(''),
    website: Joi.string().uri().allow(''),
  }).default({}),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
});
