import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: false,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

export default async function (mail_object) {
  try {
    return await transporter.sendMail(mail_object);
  } catch (err) {
    err.message = err.message || "Error occured while sending mail";
    throw err;
  }
}
