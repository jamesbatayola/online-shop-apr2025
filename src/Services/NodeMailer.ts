import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

const transporter = nodemailer.createTransport({
	host: process.env.MAILER_HOST,
	port: process.env.MAILER_PORT,
	secure: false,
	auth: {
		user: process.env.MAILER_USER,
		pass: process.env.MAILER_PASSWORD,
	},
} as SMTPTransport.Options);

export default async function (mail_object: object) {
	try {
		return await transporter.sendMail(mail_object);
	} catch (err: any) {
		err.message = err.message || "Error occured while sending mail";
		throw err;
	}
}
