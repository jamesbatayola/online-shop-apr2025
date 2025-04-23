/* eslint-disable no-unused-vars */

import express from "express";

// __diranem & __filename
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from "path";
import kleur from "kleur";
import cookieParser from "cookie-parser";

import client from "./Database/Index.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

// ----- TESTS ----- //

app.get("/ping", async (req, res, next) => {
  try {
    return res.status(500).json({
      message: "Hello world",
    });
  } catch (err) {
    next(err);
  }
});

import User from "./Models//User.js";

app.get("/users", async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.json({
      users: users,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.json({
      user: user,
    });
  } catch (err) {
    next(err);
  }
});

import bcrypt from "bcryptjs";

app.post("/login", async (req, res, next) => {
  try {
    const user = await User.findById(1);

    console.log(user.password);

    if (await bcrypt.compare("1234", user.password)) {
      return res.json({
        message: "login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }

    res.json({ message: "invalid password" });
  } catch (err) {
    next(err);
  }
});

app.post("/signup", async (req, res, next) => {
  try {
    // asd
    const user = await User.create();
  } catch (err) {
    next(err);
  }
});

import AuthRoutes from "./Routes/AuthRoutes.js";

app.use("/", AuthRoutes);

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
