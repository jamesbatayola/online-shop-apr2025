import express from "express";

import passport from "passport";
import jwt from "jsonwebtoken";

// Google Strategy
import "../Authentication/GoogleOAuth.js";

import {
  Display_Signin_Page,
  Display_Signup_Page,
} from "../Controllers/AuthController.js";

const router = express.Router();

router.get("/", Display_Signin_Page);
router.get("/signin", Display_Signin_Page);

router.get("/signup", Display_Signup_Page);

// --- GOOGLE OAUTH --- //

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// prettier-ignore
router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {

    console.log("-- FROM GOOGLE --")
    console.log(user.email)

    if (err) {
      // Handle error during authentication
      return next(err);
    }
    if (!user) {
      // Authentication failed, redirect to sign-in page
      return res.redirect('/signin');
    }

    // Log in the user
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }

      // Generate JWT
      const token = jwt.sign({ email: user.email }, process.env.JWT_CODE, {
        expiresIn: '1h',
      });

      // Set JWT as HTTP-only cookie
       res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: 'Lax',
        maxAge: 3600000, // 1 hour
      });

      // Redirect to the desired page
      return res.redirect('/shop/home');
    });

  })(req, res, next);


});

export default router;
