import db from "../Database/Index.js";
import Checkout from "./Checkout.js";

const CheckoutItem = {
	async create(cart_id, cart_item_id, user_id, total_amount) {
		const query = `
            INSERT INTO checkout_items (cart_id, cart_item_id, user_id, total_amount)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

		const res = db.query(query, [cart_id, cart_item_id, user_id, total_amount]);
		return res.rows[0];
	},

	async findById(id) {
		const query = `
            SELECT * FROM checkout_items
            WHERE id = $1;
        `;
		const res = db.query(query, [id]);
		return res.rows[0];
	},
};

export default CheckoutItem;
