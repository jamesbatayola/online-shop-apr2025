import express from "express";

const router = express.Router();

import { Jwt_Auth } from "../Authentication/JsonWebToken.ts";

import AdminController from "../Controllers/AdminController.ts";

import upload from "../Services/Multer.ts";

router.get("/", Jwt_Auth, AdminController.GET_AdminPage);

router.post("/", Jwt_Auth, upload.single("image_url"), AdminController.POST_Admin);

router.patch("/edit-product", Jwt_Auth, upload.single("image_url"), AdminController.PATCH_Product);

router.delete("/delete-product/:product_id", Jwt_Auth, AdminController.DELETE_Product);

export default router;
