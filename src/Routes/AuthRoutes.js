import express from "express";

import passport from "passport";
import jwt from "jsonwebtoken";

// Google Strategy
import "../Authentication/GoogleOAuth.js";

import AuthController from "../Controllers/AuthController.js";
import { Jwt_Auth } from "../Authentication/JsonWebToken.js";

const router = express.Router();

router.get("/logout", Jwt_Auth, AuthController.GET_Logout);

router.get("/", AuthController.GET_SignInPage);
router.get("/signin", AuthController.GET_SignInPage);

router.post("/signin", AuthController.POST_SignIn);

router.get("/signup", AuthController.GET_SignUpPage);

router.get("/email-verification", AuthController.GET_EmailVerificationPage);
router.post("/email-verification", AuthController.POST_EmailVerification);

router.get("/reset-password", AuthController.GET_DisplayPasswordPage);
router.patch("/reset-password", AuthController.POST_ResetPassword);

// router.get("email-verification");

// --- GOOGLE OAUTH --- //

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

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

      // Set user_id cookie
      res.cookie('user_id', user.id, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: 'Lax', // Use lax for cross domain cookie setting
        maxAge: 3600000, // 1 hour
      })

      // Redirect to the desired page
      return res.redirect('/shop/home');
    });

  })(req, res, next);

});

export default router;
