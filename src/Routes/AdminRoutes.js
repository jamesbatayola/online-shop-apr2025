import express from "express";

const router = express.Router();

import { Jwt_Auth } from "../Authentication/JsonWebToken.js";

import {
  Display_Admin_Page,
  Process_Admin,
} from "../Controllers/AdminController.js";

import upload from "../Services/Multer.js";

router.get("/", Jwt_Auth, Display_Admin_Page);

router.post("/", Jwt_Auth, upload.single("image_url"), Process_Admin);

export default router;
