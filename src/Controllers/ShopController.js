import ShopService from "../Services/ShopService.js";

const ShopController = {
	async GET_HomePage(req, res, next) {
		try {
			const products = await ShopService.fetch_products();

			res.render("ShopPage/Home", {
				products: products,
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
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

			// process display
			// const products_to_display = [];

			for (let cart_product of cart_products) {
				const asd = await ShopService.display_cart_products(cart_product.cart_id, cart_product.product_id);

				// products_to_display.push();

				console.log(asd);
			}

			console.log("FINISHED");

			return res.render("ShopPage/Cart", {
				products: cart_products,
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async POST_CartAddProduct(req, res, next) {
		try {
			await ShopService.add_to_cart(req);

			res.status(200).json({
				success: true,
				message: "ADDED TO CART",
			});
		} catch (err) {
			next(err);
		}
	},
};

export default ShopController;
