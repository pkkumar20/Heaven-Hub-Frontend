import Joi, { object } from "joi";
const schema = Joi.object({
  title: Joi.string().min(10).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 10 characters long",
  }),
  description: Joi.string().min(10).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters long",
  }),
  price: Joi.number().required().min(1).messages({
    "string.empty": "Price is required",
    "number.min": "Price  must be greater that or equal to 1 ",
  }),
  reservations: Joi.array().optional().allow(null, ""),
  country: Joi.object().optional().allow(null, ""),
  state: Joi.object().optional().allow(null, ""),
  city: Joi.object().optional().allow(null, ""),
  streetAddress: Joi.string().min(4).required().messages({
    "string.empty": "Street address is required",
    "string.min": "Street address must be at least 4 characters long",
  }),
  category: Joi.array().optional().allow(null, ""),
  image: Joi.object().optional().allow(null, ""),
  createdAt: Joi.date().optional().allow(null, ""),
});
export default schema;
