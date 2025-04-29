import AuthService from "../Services/AuthService.js";

const AuthController = {
	async GET_SignInPage(req, res, next) {
		try {
			res.render("AuthPage/SignIn");
		} catch (err) {
			next(err);
		}
	},

	async GET_SignUpPage(req, res, next) {
		try {
			res.render("AuthPage/SignUp");
		} catch (err) {
			next(err);
		}
	},

	async GET_Logout(req, res, next) {
		try {
			res.render("AuthPage/SignIn");

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

	async POST_SignIn(req, res, next) {
		try {
			const payload = await AuthService.process_login(req); // Will throw potential error

			res.cookie("jwt", payload.jwt_token, {
				httpOnly: true, // XSS protection
				sameSite: "Strict", // CSRF protection
				maxAge: 3600000, // 1 hour (in milliseconds)
			});

			res.cookie("user_id", payload.user_id, {
				httpOnly: true,
				sameSite: "Strict",
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

	async GET_EmailVerificationPage(req, res, next) {
		try {
			res.render("AuthPage/EmailVerification");
		} catch (err) {
			next(err);
		}
	},

	async POST_EmailVerification(req, res, next) {
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

	async GET_DisplayPasswordPage(req, res, next) {
		try {
			const { token, user_id } = req.query;

			res.render("AuthPage/ResetPassword", {
				token: token,
				user_id: user_id,
			});
		} catch (err) {
			next(err);
		}
	},

	async POST_ResetPassword(req, res, next) {
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
