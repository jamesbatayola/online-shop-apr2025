import express from "express";

import ShopController from "../Controllers/ShopController.js";

import Utils from "../Utils/Index.js";

import { Jwt_Auth } from "../Authentication/JsonWebToken.js";

const router = express.Router();

router.get("/home", Utils.isLoggedIn, ShopController.GET_HomePage);

router.get("/cart", Jwt_Auth, ShopController.GET_CartPage);

router.post("/addcart/:product_id", Jwt_Auth, ShopController.POST_CartAddProduct);

export default router;
