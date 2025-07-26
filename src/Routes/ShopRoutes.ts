import express from "express";

import ShopController from "../Controllers/ShopController.ts";

import Utils from "../Utils/Index.ts";

import { Jwt_Auth } from "../Authentication/JsonWebToken.ts";

const router = express.Router();

router.get("/home", Utils.isLoggedIn, ShopController.GET_HomePage);

router.get("/cart", Jwt_Auth, ShopController.GET_CartPage);
router.post("/addcart/:product_id", Jwt_Auth, ShopController.POST_CartAddProduct);

router.patch("/cart/plus/:cart_item_id", Jwt_Auth, ShopController.PATCH_CartPlusProduct);
router.patch("/cart/minus/:cart_item_id", Jwt_Auth, ShopController.PATCH_CartMinusProduct);

router.delete("/cart/remove/:cart_item_id", Jwt_Auth, ShopController.DELETE_CartRemoveProduct);

router.put("/cart/checkout/:cart_id", Jwt_Auth, ShopController.PUT_CartCheckoutProduct);
// router.post("/cart/checkout-all/cart_id", Jwt_Auth);

router.get("/checkout", Jwt_Auth, ShopController.GET_CheckoutPage);
router.delete("/checkout/cancel-order", Jwt_Auth, ShopController.DELETE_Checkout);

export default router;
