import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Send_Mail from "../Services/NodeMailer.js";
import crypto from "crypto";
import PasswordResetToken from "../Models/PasswordResetToken.js";

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

export const Email_Verification_Service = async (req) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    const err = new Error("User does not exist");
    err.statusCode = 404;
    throw err;
  }

  const hash_token = crypto.randomBytes(32).toString("hex");

  // Store token in Database
  try {
    await PasswordResetToken.create(user.id, hash_token);
  } catch (err) {
    err.message = err.message || "Unkown Error";
    throw err;
  }

  // Send email link with token
  Send_Mail({
    to: `${email}`.trim(), // list of receivers
    subject: "Reset Password", // Subject line
    text: "Hello",
    html: `<a href="http://localhost:11111/reset-password?token=${hash_token.trim()}&user_id=${user.id.trim()}" >Click here to change password</a>`, // html body
  });

  return;
};

export const Reset_Password_Service = async (req) => {
  const { _user_id, _token, password, confirm_password } = req.body;

  const res = await PasswordResetToken.findById(_user_id);

  // Check existence
  if (!res) {
    const err = new Error("No reset token found");
    err.statusCode = 404;
    throw err;
  }

  // Check token
  if (res.token_hash !== _token) {
    const err = new Error("Token mismatch");
    err.statusCode = 401;
    throw err;
  }

  let new_password_hash;

  try {
    new_password_hash = await bcrypt.hash(confirm_password, 10);
  } catch (err) {
    err.message = err.message || "Error while hashing password";
    throw err;
  }

  await User.changePassword(_user_id, new_password_hash);

  console.log("SUCCESS!");

  return;
};
