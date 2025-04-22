import pg from "pg";
const { Client } = pg;

// eslint-disable-next-line no-undef
export default new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || "2000",
});
