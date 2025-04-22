/* eslint-disable no-unused-vars */

import express from "express";

import kleur from "kleur";
import cookieParser from "cookie-parser";

import client from "./Database/Index.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/test", async (req, res, next) => {
  try {
    return res.status(500).json({
      message: "Hello world",
    });
  } catch (err) {
    next(err);
  }
});

// Express global error handler
app.use((err, req, res, next) => {
  res.status(err.code || 500).json({
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
