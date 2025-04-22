/* eslint-disable no-undef */

import client from "../Database/Index.js";

export default User = {
  async create() {
    const res = client.query(
      `
        INSERT INTO users (email, name)
        VALUES ($1, $2)
        RETURNING *;
        `,
      [email, username]
    );
    return res.rows[0];
  },

  async findAll() {
    const res = client.query(`SELECT * FROM users;`);
    return res.rows;
  },
};
