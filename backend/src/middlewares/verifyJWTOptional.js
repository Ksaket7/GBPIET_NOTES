import jwt from "jsonwebtoken";

export const verifyJWTOptional = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
  } catch (err) {
    // ignore invalid token
  }

  next();
};
