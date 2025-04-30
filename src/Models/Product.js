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

	async findById(id) {
		const res = await client.query(
			`
        SELECT * FROM products
        WHERE id = $1;
      `,
			[id]
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

	async update(id, name, price, description, image_url) {
		let res;

		// if no image file attach does not exist
		if (!image_url) {
			res = await client.query(
				`
				UPDATE products
				SET 
					name = $2,
					price = $3,
					description = $4
				WHERE id = $1
				RETURNING *;
        	`,
				[id, name, price, description]
			);
		} else {
			res = await client.query(
				`
				UPDATE products
				SET
					name = $2,
					price = $3,
					description = $4,
					image_url = $5
				WHERE id = $1
				RETURNING *;
				`,
				[id, name, price, description, image_url]
			);
		}

		return res.rows[0];
	},

	async delete(id) {
		const res = await client.query(
			`
				DELETE FROM products
				WHERE id = $1
				RETURNING *;
			`,
			[id]
		);

		return res.rows[0];
	},

	async getImageUrl(id) {
		const res = await client.query(
			`
				SELECT image_url FROM products
				WHERE id = $1;
			`,
			[id]
		);

		return res.rows[0]?.image_url;
	},
};

export default Product;
