import express from "express";
import { Display_Signin_Page } from "../Controllers/AuthController.js";

const router = express.Router();

router.get("/", Display_Signin_Page);

// router.get("/google/callback");

export default router;
