import { Request, Response, NextFunction } from "express";
import AdminService from "../Services/AdminService.ts";
import CsrfCsrf from "../Authentication/CsrfCsrf.ts";

const AdminController = {
	async GET_MyProductPage(req: Request, res: Response, next: NextFunction) {
		try {
			res.render("AdminPage/MyProduct", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async GET_AdminPage(req: Request, res: Response, next: NextFunction) {
		try {
			const csrfToken = req.csrfToken();
			res.render("AdminPage/Index", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
				csrfToken: req.csrfToken(),
			});
		} catch (err) {
			next(err);
		}
	},

	async POST_Admin(req: Request, res: Response, next: NextFunction) {
		try {
			const serviceResult = await AdminService.Dynamic_Process(req);

			return res.status(200).json({
				success: serviceResult.success,
				message: serviceResult.message,
				data: serviceResult.data,
			});
		} catch (err) {
			next(err);
		}
	},

	async PATCH_Product(req: Request, res: Response, next: NextFunction) {
		try {
			const serviceResult = await AdminService.update_product(req);

			return res.status(200).json({
				success: true,
				message: serviceResult.message,
				data: serviceResult.data,
			});
		} catch (err) {
			next(err);
		}
	},

	async DELETE_Product(req: Request, res: Response, next: NextFunction) {
		try {
			const serviceResult = await AdminService.delete_product(req);

			return res.status(200).json({
				success: true,
				message: `product "${serviceResult.product.id} | ${serviceResult.product.name}" is deleted`,
			});
		} catch (err) {
			next(err);
		}
	},
};

export default AdminController;
