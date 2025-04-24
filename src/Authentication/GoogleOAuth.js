import passport from "passport";
import jwt from "jsonwebtoken";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.serializeUser(async (user, done) => {
  done(null, user); // stores user in session
});

passport.deserializeUser(async (obj, done) => {
  done(null, obj); // attaches user to req.user
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:11111/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);
