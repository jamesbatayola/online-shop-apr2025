/* eslint-disable no-unused-vars */

import express from "express";
// import session from "express-session";
import passport from "passport";

// __diranem & __filename
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from "path";
import kleur from "kleur";
import cookieParser from "cookie-parser";
import cors from "cors";

import client from "./Database/Index.js";

import csrf from "./Authentication/CsrfCsrf.js";

// SEQUENCE STARTING POINT //
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Csrf protection
app.use(csrf.doubleCsrfProtection);

app.use(express.static(path.join(__dirname, "Public")));

app.use(passport.initialize());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

// ----- ROUTES ----- //
import AuthRoutes from "./Routes/AuthRoutes.js";
import ShopRoutes from "./Routes/ShopRoutes.js";
import AdminRoutes from "./Routes/AdminRoutes.js";

import TestRoutes from "./Routes/TestRoutes.js";

app.use("/", AuthRoutes);
app.use("/shop", ShopRoutes);
app.use("/admin", AdminRoutes);

app.use("/test", TestRoutes);

// Express global error handler
app.use((err, req, res, next) => {
	const status = err.statusCode || 500;

	res.status(status).json({
		success: false,
		message: err.message || "Something went wrong",
		data: err.data || "NULL",
	});
});

// --- DATABASE CONNECTION AND SERVER INIT --- //

try {
	await client.connect();
} catch (err) {
	console.log(kleur.bgRed("ERROR CONNECTING TO DATABSE"));
	console.log(err);
}

const PORT = process.env.SERVER_PORT;

const server = app.listen(PORT, async () => {
	console.log(kleur.bgWhite(`RUNNING ON PORT ${kleur.bgYellow(`${PORT}`)}`));
});

// TERMINATE TERMINAL UPON EXIT
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
	server.close(() => {
		console.log(kleur.bgRed(" -SERVER CLOSED. EXITING NOW- "));
		client.end();
		process.exit(0);
	});
}
