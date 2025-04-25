import express from "express";

import { Display_Home_Page } from "../Controllers/ShopController.js";
import { Jwt_Auth } from "../Authentication/JsonWebToken.js";

const router = express.Router();

router.get("/home", Jwt_Auth, Display_Home_Page);

export default router;
