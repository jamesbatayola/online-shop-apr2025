import passport from "passport";

// import User from "../Models/User.ts";
import client from "../../prisma/client.ts";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import type { Callback } from "bcryptjs";

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			callbackURL: "http://localhost:11111/auth/google/callback",
		},

		async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
			try {
				// google give us profile object
				// we store and fetch the google profile in the db
				// let user = await  User.findOrCreate(profile);
				let user = await client.user.findFirst({ where: { email: profile.emails[0].value } });

				if (!user) {
					throw new Error("Cannot find google account");
				}

				// user becomes argment on the next middleware
				return cb(null, user);
			} catch (error) {
				return cb(error, null);
			}
		}
	)
);
