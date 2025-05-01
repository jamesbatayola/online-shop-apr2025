import AdminService from "../Services/AdminService.js";

const AdminController = {
	async GET_MyProductPage(req, res, next) {
		try {
			res.render("AdminPage/MyProduct", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async GET_AdminPage(req, res, next) {
		try {
			res.render("AdminPage/Index", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async POST_Admin(req, res, next) {
		try {
			const payload = await AdminService.Dynamic_Process(req);

			return res.status(200).json({
				success: payload.success,
				message: payload.message,
				data: payload.data,
			});
		} catch (err) {
			next(err);
		}
	},

	async PATCH_Product(req, res, next) {
		try {
			const payload = await AdminService.update_product(req);

			return res.status(200).json({
				success: true,
				message: payload.message,
				data: payload.data,
			});
		} catch (err) {
			next(err);
		}
	},

	async DELETE_Product(req, res, next) {
		try {
			const payload = await AdminService.delete_product(req);

			return res.status(200).json({
				success: true,
				message: `product "${payload.product.id} | ${payload.product.name}" is deleted`,
			});
		} catch (err) {
			next(err);
		}
	},
};

export default AdminController;
