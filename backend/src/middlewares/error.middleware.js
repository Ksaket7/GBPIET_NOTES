import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // If it's our custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      data: null,
      message: err.message,
      success: false,
      errors: err.errors || [],
    });
  }

  // Unknown / unexpected error
  return res.status(500).json({
    statusCode: 500,
    data: null,
    message: "Internal Server Error",
    success: false,
    errors: [],
  });
};

export { errorHandler };
