import express from "express";

import ShopController from "../Controllers/ShopController.js";

import Utils from "../Utils/Index.js";

import { Jwt_Auth } from "../Authentication/JsonWebToken.js";

const router = express.Router();

router.get("/home", Utils.isLoggedIn, ShopController.GET_HomePage);

router.get("/cart", Jwt_Auth, ShopController.GET_CartPage);

router.post("/addcart/:product_id", Jwt_Auth, ShopController.POST_CartAddProduct);

router.patch("/cart/plus/:cart_item_id", Jwt_Auth, ShopController.PATCH_CartPlusProduct);
router.patch("/cart/minus/:cart_item_id", Jwt_Auth, ShopController.PATCH_CartMinusProduct);

router.delete("/cart/remove/:cart_item_id", Jwt_Auth, ShopController.DELETE_CartRemoveProduct);
// router.post("/cart/checkout/:product_id", Jwt_Auth);
// router.post("/cart/checkout-all/cart_id", Jwt_Auth);

export default router;
