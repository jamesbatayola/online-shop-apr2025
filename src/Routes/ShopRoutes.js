import express from "express";

import ShopController from "../Controllers/ShopController.js";

import Utils from "../Utils/Index.js";

const router = express.Router();

router.get("/home", Utils.isLoggedIn, ShopController.GET_HomePage);

// router.get("/home/searh", );

export default router;
