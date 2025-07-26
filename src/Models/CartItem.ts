// import db from "../Database/Index.js";

// const CartItem = {
// 	async findById(cart_item_id) {
// 		const query = `
//             SELECT * FROM cart_items
//             WHERE id = $1;
//         `;
// 		const res = await db.query(query, [cart_item_id]);
// 		return res.rows[0];
// 	},

// 	async findByCart(cart_id) {
// 		const query = `
// 			SELECT * FROM cart_items
// 			WHERE cart_id = $1;
// 		`;
// 		const res = await db.query(query, [cart_id]);
// 		return res.rows;
// 	},

// 	async findByCartAndProduct(cart_id, product_id) {
// 		const query = `
// 			SELECT *
// 			FROM cart_items
//             WHERE cart_id = $1 AND product_id = $2
// 			LIMIT 1;
// 		`;

// 		const res = await db.query(query, [cart_id, product_id]);
// 		return res.rows[0];
// 	},

// 	async addItems(cart_id, product_id) {
// 		const query = `
// 			INSERT INTO cart_items (cart_id, product_id)
// 			VALUES ($1, $2)
// 			RETURNING *;
// 		`;

// 		const res = await db.query(query, [cart_id, product_id]);
// 		return res.rows[0];
// 	},

// 	async addQuantity(cart_item_id) {
// 		const query = `
// 			UPDATE cart_items
// 			SET quantity = quantity + 1
// 			WHERE id = $1;
// 		`;

// 		const res = await db.query(query, [cart_item_id]);
// 		return res.rows[0];
// 	},

// 	async subtractQuantity(cart_item_id) {
// 		const query = `
// 			UPDATE cart_items
// 			SET quantity = quantity - 1
// 			WHERE id = $1;
// 		`;

// 		const res = await db.query(query, [cart_item_id]);
// 		return res.rows[0];
// 	},

// 	async removeById(id) {
// 		const query = `
// 			DELETE FROM cart_items
// 			WHERE id = $1;
// 		`;
// 		const res = await db.query(query, [id]);
// 		return res.rows[0];
// 	},
// };

// export default CartItem;
