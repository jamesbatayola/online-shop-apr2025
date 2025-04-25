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

import client from "./Database/Index.js";

// SEQUENCE STARTING POINT //
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

// ----- ROUTES ----- //
import AuthRoutes from "./Routes/AuthRoutes.js";
import ShopRoutes from "./Routes/ShopRoutes.js";

import TestRoutes from "./Routes/TestRoutes.js";

app.use("/", AuthRoutes);
app.use("/shop", ShopRoutes);

app.use(TestRoutes);

// Express global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
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
