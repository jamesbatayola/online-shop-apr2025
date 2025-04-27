import express from "express";

const router = express.Router();

import { Jwt_Auth } from "../Authentication/JsonWebToken.js";

import {
  Display_Add_Product_Page,
  Process_Add_Product,
} from "../Controllers/AdminController.js";

import upload from "../Services/Multer.js";

router.get("/add-product", Jwt_Auth, Display_Add_Product_Page);

router.post(
  "/add-product",
  Jwt_Auth,
  upload.single("image_url"),
  Process_Add_Product
);

export default router;
