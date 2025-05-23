// import CheckoutItem from "../Models/CheckoutItems.js";
import ShopService from "../Services/ShopService.js";
import csrf from "../Authentication/CsrfCsrf.js";
import Checkout from "../Models/Checkout.js";

const ShopController = {
	async GET_HomePage(req, res, next) {
		try {
			const products = await ShopService.fetch_products();

			const csrfToken = csrf.generateCsrfToken(req, res);

			return res.render("ShopPage/Home", {
				products: products,
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
				csrfToken: csrfToken,
			});
		} catch (err) {
			next(err);
		}
	},

	// async GET_SearchProduct(req, res, next) {
	// 	try {
	// 		console.log(req.query.search);
	// 		// res.status(200)
	// 	} catch (err) {
	// 		next(err);
	// 	}
	// },

	async GET_CartPage(req, res, next) {
		try {
			const cart_products = await ShopService.fetch_cart_products(req);

			const cart_id = cart_products[0]?.cart_id || null;

			// process display
			const products_to_display = [];

			for (let cart_product of cart_products) {
				const product_sanitize = await ShopService.display_cart_products(cart_product.cart_id, cart_product.product_id);

				products_to_display.push(product_sanitize);
			}

			return res.render("ShopPage/Cart", {
				products: products_to_display,
				cart_id: cart_id,
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
				csrfToken: req.csrfToken(),
			});
		} catch (err) {
			next(err);
		}
	},

	async POST_CartAddProduct(req, res, next) {
		try {
			await ShopService.add_to_cart(req);

			return res.status(200).json({
				success: true,
				message: "ADDED TO CART",
			});
		} catch (err) {
			next(err);
		}
	},

	async PATCH_CartPlusProduct(req, res, next) {
		try {
			const service_payload = await ShopService.plus_cart_product(req);

			return res.status(200).json({
				success: true,
				message: "Product quantity incremented successfully",
				data: service_payload,
			});
		} catch (err) {
			next(err);
		}
	},

	async PATCH_CartMinusProduct(req, res, next) {
		try {
			const service_payload = await ShopService.minus_cart_product(req);

			return res.status(200).json({
				success: true,
				message: "ASD",
				data: service_payload,
			});
		} catch (err) {
			next(err);
		}
	},

	async DELETE_CartRemoveProduct(req, res, next) {
		try {
			const service_payload = await ShopService.remove_cart_product(req);

			return res.status(200).json({
				success: true,
				message: "ASD",
				data: service_payload.cart_item,
			});
		} catch (err) {
			next(err);
		}
	},

	async PUT_CartCheckoutProduct(req, res, next) {
		try {
			const service_payload = await ShopService.cart_checkout(req);

			return res.status(200).json({
				success: true,
				message: "CHECKOUTED!",
			});
		} catch (err) {
			next(err);
		}
	},

	async GET_CheckoutPage(req, res, next) {
		try {
			const service_payload = await ShopService.get_checkout_items(req);

			res.render("ShopPage/Checkout", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
				csrfToken: req.csrfToken(),
				checkouts: service_payload.checkouts,
			});
		} catch (err) {
			next(err);
		}
	},

	async DELETE_Checkout(req, res, next) {
		try {
			const service_payload = await ShopService.removeCheckout(req);

			res.status(200).json({
				success: true,
				message: "Order successfully canceled",
				data: service_payload.checkout,
			});
		} catch (err) {
			next(err);
		}
	},
};

export default ShopController;
