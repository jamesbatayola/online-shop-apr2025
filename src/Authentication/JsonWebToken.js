import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import kleur from "kleur";

export const Jwt_Auth = async (req, res, next) => {
  const jwt_token = req.cookies.jwt;

  console.log(kleur.bgWhite("JWT TOKEN"));
  console.log(jwt_token);

  if (!jwt_token) {
    const err = new Error("No jwt token provided");
    err.statusCode = 401;
    throw err;
  }

  let decoded_token;

  console.log(kleur.bgWhite("JWT SECRET CODE"));
  console.log(process.env.JWT_CODE);

  try {
    decoded_token = jwt.verify(jwt_token, process.env.JWT_CODE);
  } catch (err) {
    if (err.statusCode === 401) throw err;
  }

  console.log(kleur.bgWhite("DECODED"));
  console.log(decoded_token);

  req.user = await User.findByEmail(decoded_token.email);

  next();
};
