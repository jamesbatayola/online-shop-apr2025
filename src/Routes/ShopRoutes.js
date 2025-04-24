import express from "express";

import { Display_Home_Page } from "../Controllers/ShopController.js";

const router = express.Router();

router.get("/home", Display_Home_Page);

export default router;
