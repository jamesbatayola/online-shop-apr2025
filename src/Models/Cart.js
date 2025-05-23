import db from "../Database/Index.js";

const Cart = {
	async create(user_id) {
		const query = `
			INSERT INTO carts (user_id, status)
            VALUES ($1, $2)
            RETURNING *;
		`;

		const res = await db.query(query, [user_id, "active"]);
		return res.rows[0];
	},

	async remove(id) {
		const query = `
			DELETE FROM carts
			WHERE id = $1
			RETURNING *;
		`;

		const res = await db.query(query, [id]);
		return res.rows[0];
	},

	async findByUserId(user_id) {
		const query = `
			SELECT * 
			FROM carts
			WHERE user_id = $1 AND status = 'active';
		`;
		const res = await db.query(query, [user_id]);
		return res.rows[0];
	},

	async findCheckouts(user_id) {
		const query = `
			SELECT *
			FROM carts
			WHERE user_id = $1 AND status = $2;
		`;

		const res = await db.query(query, [user_id, "checked_out"]);
		return res.rows;
	},

	async findLatestCheckout(user_id) {
		const query = `
			SELECT *
			FROM carts
			WHERE user_id = $1
			ORDER BY created_at ASC
			LIMIT 1;
		`;

		const res = await db.query(query, [user_id]);
		return res.rows[0];
	},

	async findById(cart_id) {
		const query = `
			SELECT * FROM carts
			WHERE id = $1;
		`;
		const res = await db.query(query, [cart_id]);
		return res.rows[0];
	},

	//FIND OR CREATE CART
	async findOrCreate(user_id) {
		// find cart by user_id and active status
		const res = await this.findByUserId(user_id);

		if (!res) {
			console.log("C");
			return await this.create(user_id);
		}

		return res;
	},

	// TO ADD PRODUCT IN CART
	// 1st - we fetch the cart and create if not exist

	async addProduct(user_id, status, product_id) {
		// find cart by user_id and active status
		const cart = await this.findOrCreate(user_id, status);

		const res = await db.query(
			`
                INSERT INTO cart_items (cart_id, product_id)
                VALUES($1, $2)
                RETURNING *;
            `,
			[cart.id, product_id]
		);

		return res.rows[0];
	},

	async findOrAddProduct(user_id, status, product_id) {
		// find cart by user_id and active status
		const user_cart = await this.findOrCreate(user_id, status);

		let res = await db.query(
			`
                SELECT *
				FROM cart_items
                WHERE cart_id = $1 AND product_id = $2
				LIMIT 1;
            `,
			[user_cart.id, product_id]
		);

		if (res.rows.length <= 0) {
			return await this.addProduct(user_cart.user_id, "active", product_id);
		} else {
			const cart_item = res.rows[0];
			return await this.addProductQuantity(cart_item.id);
		}
	},

	// returns cart item
	async addProductQuantity(cart_item_id) {
		const res = await db.query(
			`
                UPDATE cart_items
                SET quantity = quantity + 1
                WHERE id = $1
                RETURNING *;
            `,
			[cart_item_id]
		);

		return res.rows[0];
	},

	async minusProductQuantity(cart_item_id) {
		const res = await db.query(
			`
				UPDATE cart_items
				SET quantity = quantity - 1
				WHERE id = $1
				RETURNING *;
			`,
			[cart_item_id]
		);

		return res.rows[0];
	},

	async removeProduct(cart_item_id) {
		const res = await db.query(
			`
				DELETE FROM cart_items
				WHERE id = $1
				RETURNING *;
			`,
			[cart_item_id]
		);

		return res.rows[0];
	},

	async findProducts(cart_id) {
		const res = await db.query(
			`
				SELECT * FROM cart_items
				WHERE cart_id = $1;
			`,
			[cart_id]
		);

		return res.rows;
	},

	async findProduct(cart_id, product_id) {
		const query = `
			SELECT * 
			FROM cart_items
            WHERE cart_id = $1 AND product_id = $2
		`;

		const res = await db.query(query, [cart_id, product_id]);
		return res.rows[0];
	},

	async cartInactive(cart_id) {
		const query = `
			UPDATE carts
			SET status = 'checked_out'
			WHERE id = $1
			RETURNING *;
		`;

		const res = await db.query(query, [cart_id]);
		return res.rows[0];
	},
};

export default Cart;
