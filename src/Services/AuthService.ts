import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Send_Mail from "./NodeMailer.ts";
import crypto from "crypto";
// import PasswordResetToken from "../Models/PasswordResetToken.ts";

import type HttpError from "../Interface/httpError.ts";
import client from "../../prisma/client.ts";
import type { Request } from "express";

const AuthService = {
	async create_account(req: Request) {
		const { email, name, password } = req.body;

		const user = await client.user.create({
			data: {
				name: name,
				email: email,
				password: password,
			},
		});

		return user;
	},

	async process_login(req: Request) {
		const { email, password } = req.body;

		const user = await client.user.findFirst({ where: { email: email } });

		// Verify existence
		if (!user) {
			const err = new Error("User does not exist") as HttpError;
			err.statusCode = 404;
			throw err;
		}

		// Verify password
		if (!(await bcrypt.compare(password, user.password))) {
			const err = new Error("Invalid password") as HttpError;
			err.statusCode = 401;
			throw err;
		}

		const jwt_token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_CODE as string);

		return {
			user_id: user.id,
			jwt_token: jwt_token,
		};
	},

	async send_email_verification(req: Request) {
		const { email } = req.body;

		const user = await client.user.findFirst({ where: { email: email } });

		if (!user) {
			const err = new Error("User does not exist") as HttpError;
			err.statusCode = 404;
			throw err;
		}

		let token;
		let hash_token: string;

		// Check if email already has reset_password_token instance in the database
		try {
			token = await client.passwordResetToken.findFirst({ where: { user_id: user.id } });
		} catch (err) {
			throw err;
		}

		if (!token) {
			hash_token = crypto.randomBytes(32).toString("hex");

			// Store reset_password_token instance in Database
			try {
				await client.passwordResetToken.create({ data: { user_id: user.id, token_hash: hash_token } });
			} catch (err) {
				throw err;
			}
		} else {
			hash_token = token.token_hash;
		}

		// Send email link with token
		Send_Mail({
			to: `${email}`.trim(), // list of receivers
			subject: "Reset Password", // Subject line
			text: "Hello",
			html: `<a href="http://localhost:11111/reset-password?token=${hash_token.trim()}&user_id=${user.id.trim()}" >Click here to change password</a>`, // html body
		});

		return;
	},

	async reset_password(req: Request) {
		const { _user_id, _token, confirm_password } = req.body;

		const resetToken = await client.passwordResetToken.findFirst({ where: { user_id: _user_id } });

		// Check existence
		if (!resetToken) {
			const err = new Error("No reset token found") as HttpError;
			err.statusCode = 404;
			throw err;
		}

		// Check token
		if (resetToken.token_hash !== _token) {
			const err = new Error("Token mismatch") as HttpError;
			err.statusCode = 401;
			throw err;
		}

		let new_password_hash;

		// encrypting new password
		try {
			new_password_hash = await bcrypt.hash(confirm_password, 10);
		} catch (err) {
			throw err;
		}

		// Update user's password in the database
		await client.user.update({ where: { id: _user_id }, data: { password: new_password_hash } });

		// Remove instance from database
		await client.passwordResetToken.delete({ where: { id: resetToken.id } });

		console.log("SUCCESS!");

		return;
	},
};

export default AuthService;
