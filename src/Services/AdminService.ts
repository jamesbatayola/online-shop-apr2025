import client from "../../prisma/client.ts";
import fs from "fs";
import path from "path";

// __diranem & __filename
import { fileURLToPath } from "url";
import { dirname } from "path";
import kleur from "kleur";

import Utils from "../Utils/Index.ts";
import type { Request } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------- PRIVATE ------- //
const _postAddProduct = async (req) => {
	const file = req.file;
	const { name, price, description } = req.body;

	let image_url;

	if (!file) {
		image_url = "null";
	} else {
		image_url = file.filename;
	}

	// const product = await Product.create(name, price, image_url, description, req.user.id);
	const product = await client.product.create({
		data: { name: name, price: price, image_url: image_url, description: description, user_id: req.user.id },
	});

	return product;
};

const _getUserProducts = async (req: Request) => {
	// const products = await Product.findByUserId(req.user.id);
	const product = await client.product.findFirst({ where: { user_id: req.user.id } });
	return products;
};

// Main
const AdminService = {
	async Dynamic_Process(req: Request) {
		const mode = req.query.mode;

		if (mode === "add-product") {
			const product = await _postAddProduct(req);

			return {
				success: true,
				message: "Product added successfully",
				data: {
					product: {
						name: product.name,
						price: product.price,
						description: product.description,
						image_url: product.image_url,
						seller: product.user_id,
					},
				},
			};
		}

		// Get user products
		if (mode === "view_products") {
			const products = await _getUserProducts(req);

			return {
				success: true,
				message: "User products fetched successfuly",
				data: {
					products: products,
				},
			};
		}

		if (mode === "view_product" && req.query.id) {
			const product_id = req.query.id;

			const product = await Product.findById(product_id);

			return {
				success: true,
				message: "User product fetched successfully",
				data: {
					product: product,
				},
			};
		}
	},

	async update_product(req: Request) {
		// const file = req.file;
		const { id, name, price, description } = req.body;

		const file = req.file;
		let image_url = undefined;

		let message = "No image deleted";

		// Remove old photo from local disk
		if (file) {
			image_url = file.filename;

			const old_image = await Product.getImageUrl(id);

			const file_path = path.join(__dirname, "..", "Public", "img", old_image);

			// check if old image path stil exist locally
			if (await Utils.fileExist(file_path)) {
				fs.unlinkSync(file_path);
			}

			message = "Old image deleted";
		}

		const product = await Product.update(id, name, price, description, image_url);

		console.log(kleur.bgCyan("FINISH!"));

		return {
			data: product,
			message: message,
		};
	},

	async delete_product(req: Request) {
		const { product_id } = req.params;

		const image_url = await Product.getImageUrl(product_id);
		const image_url_path = path.join(__dirname, "..", "Public", "img", image_url);

		if (Utils.fileExist(image_url_path)) {
			fs.unlinkSync(image_url_path);
		}

		const product = await Product.delete(product_id);

		return { product };
	},
};

export default AdminService;
