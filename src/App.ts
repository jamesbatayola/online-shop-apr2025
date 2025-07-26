/* eslint-disable no-unused-vars */

import express, { Request, Response, NextFunction } from "express";
import type { Server } from "http";
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

// import client from "./Database/Index.js";
import prismaClient from "../prisma/client.ts";

import csrf from "./Authentication/CsrfCsrf.ts";

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
import AuthRoutes from "./Routes/AuthRoutes.ts";
import ShopRoutes from "./Routes/ShopRoutes.ts";
import AdminRoutes from "./Routes/AdminRoutes.ts";

import TestRoutes from "./Routes/TestRoutes.ts";

app.use("/", AuthRoutes);
app.use("/shop", ShopRoutes);
app.use("/admin", AdminRoutes);

app.use("/test", TestRoutes);

// custom error
interface HttpError extends Error {
	statusCode: number;
	data: object;
}

// Express global error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
	const status = err.statusCode || 500;

	res.status(status).json({
		success: false,
		message: err.message || "Something went wrong",
		data: err.data || "NULL",
	});
});

// --- DATABASE CONNECTION AND SERVER INIT --- //

try {
	await prismaClient.$connect();
	console.log(kleur.bgWhite("DATABASE CONNECTED"));
} catch (err) {
	console.log(kleur.bgRed("ERROR CONNECTING TO DATABSE"));
	console.log(err);
}

let server: Server;

try {
	// ONLY STARTS THE SERVER BY DIRECT CALL
	if (require.main === module) {
		server = app.listen(process.env.SERVER_PORT || 11111);
	}

	console.log(kleur.bgWhite(`RUNNING ON PORT ${kleur.bgYellow(`${process.env.SERVER_PORT}`)}`));
} catch (err) {
	console.log(kleur.bgRed("ERROR STARTING SERVER"));
	console.log(err);
}

// GRACEFUL SHUTDOWN

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
	server.close(() => {
		console.log(kleur.bgRed(" -SERVER CLOSED. EXITING NOW- "));
		prismaClient.$disconnect();
		process.exit(0);
	});
}
