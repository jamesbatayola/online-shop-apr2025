import client from "../Database/Index.js";
import Product from "./Product.js";

const Cart = {
	async create(user_id, status) {
		const res = await client.query(
			`
                INSERT INTO carts (user_id, status)
                VALUES ($1, $2)
                RETURNING *;
            `,
			[user_id, status]
		);

		return res.rows[0];
	},

	//FIND OR CREATE CART
	async findOrCreate(user_id, status) {
		// find cart by user_id and active status
		let res = await client.query(
			`
	            SELECT * FROM carts
	            WHERE user_id = $1 AND status = $2
				LIMIT 1;
	        `,
			[user_id, status]
		);

		// if that cart does no exist we create new one
		if (res.rows.length <= 0) {
			return await this.create(user_id, status);
		}

		return res.rows[0];
	},

	// TO ADD PRODUCT IN CART
	// 1st - we fetch the cart and create if not exist

	async addProduct(user_id, status, product_id) {
		// find cart by user_id and active status
		const cart = await this.findOrCreate(user_id, status);

		const res = await client.query(
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

		let res = await client.query(
			`
                SELECT * FROM cart_items
                WHERE cart_id = $1 AND product_id = $2
				LIMIT 1;
            `,
			[user_cart.id, product_id]
		);

		if (res.rows.length <= 0) {
			return await this.addProduct(user_cart.id, product_id);
		} else {
			const cart_item = res.rows[0];
			return await this.addProductQuantity(cart_item.id);
		}
	},

	// returns cart item
	async addProductQuantity(cart_item_id) {
		const res = await client.query(
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
		const res = await client.query(
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
		const res = await client.query(
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
		const res = await client.query(
			`
				SELECT * FROM cart_items
				WHERE cart_id = $1;
			`,
			[cart_id]
		);

		return res.rows;
	},

	async findProduct(cart_id, product_id) {
		const res = await client.query(
			`
                SELECT * FROM cart_items
                WHERE cart_id = $1 AND product_id = $2
            `,
			[cart_id, product_id]
		);

		return res.rows[0];
	},
};

export default Cart;
