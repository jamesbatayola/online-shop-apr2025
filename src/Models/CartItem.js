import client from "../Database/Index.js";

const CartItem = {
	async findById(cart_item_id) {
		const query = `
            SELECT * FROM cart_items
            WHERE id = $1;
        `;
		const res = await client.query(query, [cart_item_id]);
		return res.rows[0];
	},
};

export default CartItem;
