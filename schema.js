const Joi =require('joi');
const { create } = require('./models/listing');
 module.exports.listingschema =Joi.object({
    lististing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string(),
        image:Joi.string().allow('',null),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required()
    }).required()

});
module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
        createAt:Joi.date().default(Date.now).allow(null, ''),
    })
        .required()});

module.exports.userSchema = Joi.object({
    user: Joi.object({
        username:Joi.string().required(),
        email:Joi.string().email().required(),
        password:Joi.string().required().min(6).max(30),
    }).required()});        