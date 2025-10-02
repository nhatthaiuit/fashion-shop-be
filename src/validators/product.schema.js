import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(160).required(),
  category: Joi.string().required(),
  image: Joi.string().uri().required(),
  price: Joi.number().min(0).required(),
  brand: Joi.string().required(),
  countInStock: Joi.number().integer().min(0).default(0),
  rating: Joi.number().min(0).max(5).default(0),
  numReviews: Joi.number().integer().min(0).default(0),
  description: Joi.string().allow(""),
});

export const updateProductSchema = createProductSchema.fork(
  ["name", "category", "image", "price", "brand"], 
  (schema) => schema.optional()
);
