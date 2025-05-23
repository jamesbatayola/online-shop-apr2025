import client from "../Database/Index.js";

const PasswordResetToken = {
  async create(user_id, token_hash) {
    const res = await client.query(
      `
          INSERT INTO password_reset_tokens (user_id, token_hash)
          VALUES ($1, $2)
          RETURNING *;
       `,
      [user_id, token_hash]
    );

    return res.rows[0];
  },

  async findById(user_id) {
    const res = await client.query(
      `
        SELECT * FROM password_reset_tokens
        WHERE user_id = $1 
        AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1;
      `,
      [user_id]
    );

    return res.rows[0];
  },

  async remove(user_id) {
    const res = await client.query(
      `
        DELETE FROM password_reset_tokens
        WHERE user_id = $1
        RETURNING *;
      `,
      [user_id]
    );

    return res.rows[0];
  },
};

export default PasswordResetToken;
