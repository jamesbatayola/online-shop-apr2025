import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Signin_Service = async (req) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  // Verify existence
  if (!user) {
    const err = new Error("User does not exist");
    err.statusCode = 404;
    throw err;
  }

  // Verify password
  if (!(await bcrypt.compare(password, user.password))) {
    const err = new Error("Invalid password");
    err.statusCode = 401;
    throw err;
  }

  const jwt_token = await jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_CODE
  );

  return {
    user: user,
    jwt_token: jwt_token,
  };
};
