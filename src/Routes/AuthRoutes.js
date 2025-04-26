import express from "express";

import passport from "passport";
import jwt from "jsonwebtoken";

// Google Strategy
import "../Authentication/GoogleOAuth.js";

import {
  Display_Email_Verification_Page,
  Display_Signin_Page,
  Display_Signup_Page,
  Process_Signin,
  Process_Email_Verification,
  Display_Reset_Password_Page,
  Process_Reset_Password,
} from "../Controllers/AuthController.js";

const router = express.Router();

router.get("/", Display_Signin_Page);
router.get("/signin", Display_Signin_Page);

router.post("/signin", Process_Signin);

router.get("/signup", Display_Signup_Page);

router.get("/email-verification", Display_Email_Verification_Page);
router.post("/email-verification", Process_Email_Verification);

router.get("/reset-password", Display_Reset_Password_Page);
router.post("/reset-password", Process_Reset_Password);

// router.get("email-verification");

// --- GOOGLE OAUTH --- //

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// prettier-ignore
router.get('/auth/google/callback', (req, res, next) => {
  // custom callback middleware for making stateles authentication
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    
     // Handle error during authentication
    if (err) {
      return next(err);
    }

     // Authentication failed, redirect to sign-in page
    if (!user) {
      return res.redirect('/signin');
    }

    // Log in the user
    // built it method passed by Passport to req object
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
        sameSite: 'Lax', // Use lax for cross domain cookie setting
        maxAge: 3600000, // 1 hour
      });

      // Redirect to the desired page
      return res.redirect('/shop/home');
    });

  })(req, res, next);

});

export default router;
