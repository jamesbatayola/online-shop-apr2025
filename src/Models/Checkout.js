import db from "../Database/Index.js";

const Checkout = {
	async create(cart_id) {
		const query = `
            INSERT INTO checkouts (cart_id)
            VALUES ($1)
            RETURNING *;
        `;
		const res = await db.query(query, [cart_id]);
		return res.rows[0];
	},

	async findById(id) {
		const query = `
            SELECT * FROM checkouts
            WHERE id = $1;
        `;
		const res = await db.query(query, [id]);
		return res.rows[0];
	},

	async findByCart(cart_id) {},

	async findByCartAndOnProcess(cart_id) {
		const query = `
			SELECT * 
			FROM checkouts
			WHERE cart_id = $1 AND status = $2
			LIMIT 1;
		`;

		const res = await db.query(query, [cart_id, "on_process"]);
		return res.rows[0];
	},

	async findByCartDelivered(cart_id) {
		const query = `
			SELECT *
			FROM checkouts
			WHERE cart_id = $1 AND staus = $2;
		`;

		const res = await db.query(query, [cart_id, "delivered"]);
		return res.rows;
	},

	async remove(id) {
		const query = `
			DELETE FROM checkouts
			WHERE id = $1
			RETURNING *;
		`;

		const res = await db.query(query, [id]);
		return res.rows[0];
	},
};

export default Checkout;
