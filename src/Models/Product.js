import client from "../Database/Index.js";

const Product = {
  async create(name, price, image_url, description, user_id) {
    const res = await client.query(
      `
        INSERT INTO products (name, price, image_url, description, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `,
      [name, price, image_url, description, user_id]
    );

    return res.rows[0];
  },

  async findAll() {
    const res = await client.query(`SELECT * FROM products;`);
    return res.rows;
  },

  async findById(product_id) {
    const res = await client.query(
      `
        SELECT * FROM products
        WHERE id = $1;
      `,
      [product_id]
    );

    return res.rows[0];
  },

  async findByUserId(user_id) {
    const res = await client.query(
      `
        SELECT * FROM products
        WHERE user_id = $1;
      `,
      [user_id]
    );

    return res.rows;
  },
};

export default Product;
