const Joi = require('joi');

module.exports.listingschema = Joi.object({
  lististing: Joi.object({
    title:       Joi.string().required(),
    description: Joi.string().allow('', null),
    image:       Joi.string().allow('', null),
    price:       Joi.number().required().min(0),
    location:    Joi.string().required(),
    country:     Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating:   Joi.number().required().min(1).max(5),
    comment:  Joi.string().required(),
    createAt: Joi.date().default(Date.now).allow(null, ''),
  }).required(),
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().required().min(3).max(30).messages({
      'string.empty': 'Username is required',
      'string.min':   'Username must be at least 3 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be valid',
    }),
    password: Joi.string().required().min(6).max(30).messages({
      'string.empty': 'Password is required',
      'string.min':   'Password must be at least 6 characters',
    }),
  }).required(),
});
