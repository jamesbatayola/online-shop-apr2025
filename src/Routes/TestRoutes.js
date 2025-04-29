import express from "express";

import User from "../Models/User.js";
import Product from "../Models/Product.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/ping", async (req, res, next) => {
	try {
		return res.status(500).json({
			message: "Hello world",
		});
	} catch (err) {
		next(err);
	}
});

router.get("/users", async (req, res, next) => {
	try {
		const users = await User.findAll();

		res.json({
			users: users,
		});
	} catch (err) {
		next(err);
	}
});

router.get("/users/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		res.json({
			user: user,
		});
	} catch (err) {
		next(err);
	}
});

router.post("/signin", async (req, res, next) => {
	try {
		const user = await User.findById(1);

		console.log(user.password);

		if (await bcrypt.compare("1234", user.password)) {
			return res.json({
				message: "login successful",
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			});
		}

		res.json({ message: "invalid password" });
	} catch (err) {
		next(err);
	}
});

router.post("/signup", async (req, res, next) => {
	try {
		// asd
		// const user = await User.create();
	} catch (err) {
		next(err);
	}
});

router.get("/products", async (req, res, next) => {
	try {
		const products = await Product.findAll();

		res.json({
			products: products,
		});
	} catch (err) {
		next(err);
	}
});

router.get("/add-product", async (req, res, next) => {
	try {
		const product = await Product.create("item_1", "10.99", "no image", "dummy description", "27894be8-78fd-4a45-bc73-3ec8e3e17bc6");

		res.status(200).json({
			data: product,
		});
	} catch (err) {
		next(err);
	}
});

export default router;
