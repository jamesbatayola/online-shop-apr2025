// import Product from "../Models/Product.ts";
// import Cart from "../Models/Cart.ts";
// import CartItem from "../Models/CartItem.ts";
// import Checkout from "../Models/Checkout.ts";
// import CheckoutItem from "../Models/CheckoutItems.ts";

import client from "../../prisma/client.ts";
import type { Request } from "express";
import type HttpError from "../Interface/httpError.ts";

const ShopService = {
	async fetch_products() {
		const products = await client.product.findMany();
		return products;
	},

	// fetch carts products of user
	async fetch_cart_products(req: Request) {
		let user_cart = await client.cart.findFirst({ where: { user_id: req.user?.id, status: "active" } });

		if (user_cart) {
			user_cart = await client.cart.create({ data: { user_id: req.user?.id as string } });
		}

		const cart_products = await client.product.findMany({ where: { user_id: user_cart?.user_id } });

		return { cart_products, user_cart };
	},

	async add_to_cart(req: Request) {
		const { product_id } = req.params;

		// find user cart
		let cart = await client.cart.findFirst({ where: { user_id: req.user?.id } });

		if (!cart) {
			cart = await client.cart.create({ data: { user_id: req.user?.id as string } });
		}

		const cart_item = await client.cartItem.findFirst({ where: { cart_id: cart.id, product_id: product_id } });

		// check cart item existance
		if (!cart_item) {
			await client.cartItem.create({ data: { cart_id: cart?.id as string, product_id: product_id } });
		} else {
			await client.cartItem.update({ where: { id: cart_item?.id }, data: { quantity: (cart_item.quantity += 1) } });
		}
	},

	async display_cart_products(cart_id: string, product_id: string) {
		const cart_item = await client.cartItem.findFirst({ where: { cart_id: cart_id, product_id: product_id } });

		if (!cart_item) {
			const err = new Error("Cart item does not exist") as HttpError;
			err.statusCode = 404;
			throw err;
		}

		const product = await client.product.findFirst({ where: { id: product_id } });

		return {
			cart_item_id: cart_item.id,

			//! POSSIBLE UNDEFINED
			image: product?.image_url,
			name: product?.name,
			description: product?.description,
			quantity: cart_item?.quantity,
			price_each: product?.price,
			price_total: Number(product?.price) * cart_item.quantity,
		};
	},

	// must returns new quantity
	async plus_cart_product(req: Request) {
		const { cart_item_id } = req.params;

		const cart_item = await client.cartItem.findUnique({ where: { id: cart_item_id } });
		const current_quantity: number = cart_item!.quantity;

		const cart_item_updated = await client.cartItem.update({
			where: { id: cart_item_id },
			data: { quantity: current_quantity + 1 },
		});

		const product = await client.product.findFirst({ where: { id: cart_item?.product_id } });

		return {
			new_quantity: cart_item_updated.quantity,

			//! POSSIBLE UNDEFINED
			new_total_price: Number(product?.price) * cart_item_updated.quantity,
		};
	},

	async minus_cart_product(req: Request) {
		const { cart_item_id } = req.params;
		let { current_quantity } = req.body;

		let new_quantity;
		let new_total_price;

		const cart_item = await client.cartItem.findUnique({ where: { id: cart_item_id } });

		if (current_quantity === 1) {
			await this.remove_cart_product(req);
			new_quantity = 0;
			new_total_price = 0;
		} else {
			const cart_item_updated = await client.cartItem.update({ where: { id: cart_item_id }, data: { quantity: (current_quantity -= 1) } });

			const product = await client.product.findUnique({ where: { id: cart_item?.product_id } });

			new_quantity = cart_item_updated.quantity;

			//! POSSIBLE UNDEFINED
			new_total_price = Number(product?.price) * cart_item_updated.quantity;
		}

		return {
			new_quantity: new_quantity,
			new_total_price: new_total_price,
		};
	},

	async remove_cart_product(req: Request) {
		const { cart_item_id } = req.params;

		const cart_item = await client.cartItem.delete({ where: { id: cart_item_id } });

		return { cart_item };
	},

	// Todo
	async cart_checkout(req: Request) {
		const { cart_id } = req.params;

		const cart_items = await client.cartItem.findMany({ where: { cart_id: cart_id } });

		const checkout_items_display = [];

		const checkout = await client.checkout.create({ data: { cart_id: cart_id, user_id: req.user?.id as string } });

		for (let cart_item of cart_items) {
			const product = await client.product.findUnique({ where: { id: cart_item.product_id } });

			const total_price: number = Number(product?.price) * cart_item.quantity;

			const checkout_item = await client.checkoutItem.create({
				data: { quantity: cart_item.quantity, price: total_price, checkout_id: checkout.id, cart_id: cart_id },
			});

			checkout_items_display.push(checkout_item);

			// Cart Items is now removed
			await client.cartItem.delete({ where: { id: cart_item.id } });
		}

		await client.cart.update({ where: { id: cart_id }, data: { status: "checked_out" } }); // old cart becomes inactive

		await client.cart.create({ data: { user_id: req.user?.id as string } }); // new cart added

		return { checkout_items_display };
	},

	async get_checkout_items(req: Request) {
		const cart = await client.cart.findFirst({ where: { user_id: req.user?.id, status: "checked_out" } });

		return await client.checkoutItem.findMany({ where: { cart_id: cart?.id } });
	},

	async removeCheckout(req: Request) {
		const { checkout_id } = req.body;

		const checkout = await client.checkout.delete({ where: { id: checkout_id } });

		await client.cart.delete({ where: { id: checkout.cart_id } }); // removes the cart linked to the checkout

		return { checkout };
	},
};

export default ShopService;
