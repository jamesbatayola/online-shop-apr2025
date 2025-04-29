import passport from "passport";

import User from "../Models/User.js";

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
				// google give us profile object
				// we store and fetch the google profile in the db
				let user = await User.findOrCreate(profile);

				// user becomes argment on the next middleware
				return cb(null, user);
			} catch (error) {
				return cb(error, null);
			}
		}
	)
);
