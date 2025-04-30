import { Get_Products } from "../Services/ShopService.js";

const ShopController = {
	async GET_HomePage(req, res, next) {
		try {
			const products = await Get_Products();

			res.render("ShopPage/Home", {
				products: products,
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async GET_SearchProduct(req, res, next) {
		try {
			console.log(req.query.search);
			// res.status(200)
		} catch (err) {
			next(err);
		}
	},
};

export default ShopController;
