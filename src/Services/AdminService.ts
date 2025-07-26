import client from "../../prisma/client.ts";
import fs from "fs";
import path from "path";

// __diranem & __filename
import { fileURLToPath } from "url";
import { dirname } from "path";

import Utils from "../Utils/Index.ts";
import type { Request } from "express";
import type HttpError from "../Interface/httpError.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------- PRIVATE ------- //
const _postAddProduct = async (req: Request) => {
	const file = req.file;
	const { name, price, description } = req.body;

	let image_url;

	if (!file) {
		image_url = "null";
	} else {
		image_url = file.filename;
	}

	const user_id = req.user?.id;

	if (!user_id) {
		const err = new Error("No user id");
		throw err;
	} else {
		const product = await client.product.create({
			data: { name: name, price: price, image_url: image_url, description: description, user_id: user_id },
		});
		return product;
	}
};

const _getUserProducts = async (req: Request) => {
	// const products = await Product.findByUserId(req.user.id);
	const products = await client.product.findFirst({ where: { user_id: req.user?.id } });
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
			const product_id = req.query.id as string;

			const product = await client.product.findFirst({ where: { id: product_id } });

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

		const product = await client.product.findFirst({ where: { id: id } });

		// Remove old photo from local disk
		if (file) {
			image_url = file.filename;

			const old_image = product?.image_url;

			if (!old_image) {
				const err = new Error("Image_url not found") as HttpError;
				err.statusCode = 404;
				throw err;
			}

			const file_path = path.join(__dirname, "..", "Public", "img", old_image);

			// check if old image path stil exist locally
			if (await Utils.fileExist(file_path)) {
				fs.unlinkSync(file_path);
			}

			message = "Old image deleted";
		}

		await client.product.update({
			where: { id: product?.id },
			data: {
				id: product?.name,
				description: product?.description,
				image_url: product?.image_url,
			},
		});

		return {
			data: product,
			message: message,
		};
	},

	async delete_product(req: Request) {
		const { product_id } = req.params;

		// const image_url = await Product.getImageUrl(product_id);
		const product = await client.product.findFirst({ where: { id: product_id } });

		const image_url_path = path.join(__dirname, "..", "Public", "img", product?.image_url as string);

		if (await Utils.fileExist(image_url_path)) {
			fs.unlinkSync(image_url_path);
		}

		await client.product.delete({ where: { id: product?.id } });

		console.log("Product is deleted successfully");
	},
};

export default AdminService;
