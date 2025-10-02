import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const data = ["POST","PUT","PATCH"].includes(req.method) ? req.body : req.query;
  const { error, value } = schema.validate(data, { abortEarly:false, stripUnknown:true });
  if (error) {
    const msg = error.details.map(d=>d.message).join(", ");
    return next(new ApiError(400, msg));
  }
  if (["POST","PUT","PATCH"].includes(req.method)) req.body = value; else req.query = value;
  next();
};
