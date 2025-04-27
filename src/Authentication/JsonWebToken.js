import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export const Jwt_Auth = async (req, res, next) => {
  const jwt_token = req.cookies.jwt;

  if (!jwt_token) {
    const err = new Error("No jwt token provided");
    err.statusCode = 401;
    throw err;
  }

  let decoded_token;

  try {
    decoded_token = jwt.verify(jwt_token, process.env.JWT_CODE);
  } catch (err) {
    if (err.statusCode === 401) throw err;
  }

  const user = await User.findByEmail(decoded_token.email);

  req.user = {
    id: user.id,
    email: user.email,
  };

  next();
};
