import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  description: Joi.string().allow("", null),
});

export const updateCategorySchema = createCategorySchema.fork(["name"], s=>s.optional());
