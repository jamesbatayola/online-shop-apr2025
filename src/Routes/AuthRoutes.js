import express from "express";

import passport from "passport";

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

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    successRedirect: "/home",
  })
);

export default router;
