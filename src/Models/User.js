/* eslint-disable no-undef */

import client from "../Database/Index.js";

const User = {
  async create(email, username) {
    try {
      const res = await client.query(
        `
          INSERT INTO users (email, name, password)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
        [email, username, password]
      );

      return res.rows[0];
    } catch (err) {
      if (err.code === "23505") {
        const conflictError = new Error("User already exists");
        conflictError.statusCode = 409;
        throw conflictError;
      }

      throw err;
    }
  },

  async findAll() {
    const res = await client.query(`SELECT * FROM users;`);
    return res.rows;
  },

  async findById(id) {
    const res = await client.query(`SELECT * FROM users WHERE id = $1;`, [id]);

    if (res.rows.length === 0) {
      const notFoundError = new Error("User not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    return res.rows[0];
  },

  async getCart(user_id) {
    const user_cart = await client.query(
      `SELECT * FROM carts WHERE user_id = $1`,
      [user_id]
    );
  },
};

export default User;
