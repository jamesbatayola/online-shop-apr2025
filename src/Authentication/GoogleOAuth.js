import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:11111/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // Step 1: Check if user already exists in DB
        let user = await User.findOrCreate(profile);

        // Step 3: Pass user to Passport
        return cb(null, user); // This becomes `req.user`
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
