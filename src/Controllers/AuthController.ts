import type { Request, Response, NextFunction } from "express";
import AuthService from "../Services/AuthService.ts";

const AuthController = {
	async GET_SignInPage(req: Request, res: Response, next: NextFunction) {
		try {
			res.render("AuthPage/SignIn", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async GET_SignUpPage(req: Request, res: Response, next: NextFunction) {
		try {
			res.render("AuthPage/SignUp", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async GET_Logout(req: Request, res: Response, next: NextFunction) {
		try {
			res.render("AuthPage/SignIn", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});

			// REMOVE COOKIES //

			res.clearCookie("jwt", {
				httpOnly: true,
				sameSite: "Strict",
				path: "/",
			});

			res.clearCookie("user_id", {
				httpOnly: true,
				sameSite: "Strict",
				path: "/",
			});
		} catch (err) {
			next(err);
		}
	},

	async POST_SignIn(req: Request, res: Response, next: NextFunction) {
		try {
			const payload = await AuthService.process_login(req); // Will throw potential error

			res.cookie("jwt", payload.jwt_token, {
				httpOnly: true, // XSS protection
				sameSite: "strict", // CSRF protection
				maxAge: 3600000, // 1 hour (in milliseconds)
			});

			res.cookie("user_id", payload.user_id, {
				httpOnly: false,
				sameSite: "strict",
				maxAge: 3600000,
			});

			return res.status(200).json({
				success: true,
				message: "Login successful",
				data: {
					user_id: payload.user_id,
				},
			});
		} catch (err) {
			next(err);
		}
	},

	async PUT_SignUp(req: Request, res: Response, next: NextFunction) {
		try {
			const payload = await AuthService.create_account(req);

			res.status(200).json({
				success: true,
				message: "Account created successfully",
				data: payload.user,
			});
		} catch (err) {
			next(err);
		}
	},

	async GET_EmailVerificationPage(req: Request, res: Response, next: NextFunction) {
		try {
			res.render("AuthPage/EmailVerification", {
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
				csrfToken: req.csrfToken(),
			});
		} catch (err) {
			next(err);
		}
	},

	async POST_EmailVerification(req: Request, res: Response, next: NextFunction) {
		try {
			await AuthService.send_email_verification(req);

			res.status(200).json({
				success: true,
				message: "A link was sent your email",
			});
		} catch (err) {
			next(err);
		}
	},

	async GET_DisplayPasswordPage(req: Request, res: Response, next: NextFunction) {
		try {
			const { token, user_id } = req.query;

			res.render("AuthPage/ResetPassword", {
				token: token,
				user_id: user_id,
				isLoggedIn: req.cookies.jwt && req.cookies.user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async POST_ResetPassword(req: Request, res: Response, next: NextFunction) {
		try {
			await AuthService.reset_password(req);

			res.status(200).json({
				success: true,
				message: "Changed password successfully",
			});
		} catch (err) {
			next(err);
		}
	},
};

export default AuthController;
