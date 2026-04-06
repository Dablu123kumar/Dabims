import { ZodError } from "zod";

/**
 * Returns an Express middleware that validates req.body against the given Zod schema.
 * On failure, responds with 422 and an array of field-level error messages.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(422).json({ success: false, errors });
  }
  req.body = result.data; // Replace with parsed/coerced data
  next();
};
