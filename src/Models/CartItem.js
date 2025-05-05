import db from "../Database/Index.js";

const CartItem = {
	async findById(cart_item_id) {
		const query = `
            SELECT * FROM cart_items
            WHERE id = $1;
        `;
		const res = await db.query(query, [cart_item_id]);
		return res.rows[0];
	},

	async removeById(id) {
		const query = `
			DELETE FROM cart_items
			WHERE id = $1;
		`;
		const res = await db.query(query, [id]);
		return res.rows[0];
	},

	async findByCart(cart_id) {
		const query = `
			SELECT * FROM cart_items
			WHERE cart_id = $1;
		`;
		const res = await db.query(query, [cart_id]);
		return res.rows;
	},
};

export default CartItem;
