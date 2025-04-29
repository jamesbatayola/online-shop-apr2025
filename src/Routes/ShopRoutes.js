import express from "express";

import ShopController from "../Controllers/ShopController.js";

const router = express.Router();

router.get("/home", ShopController.GET_HomePage);

// router.get("/home/searh", );

export default router;
