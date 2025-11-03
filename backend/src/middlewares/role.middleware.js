import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Roles could be: ["student", "cr", "faculty", "admin"]
export const verifyRole = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const user = req.user; // added by verifyJWT

    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    next();
  });
