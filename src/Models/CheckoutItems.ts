// import db from "../Database/Index.js";

// const CheckoutItem = {
// 	async create(checkout_id, cart_id, product_id, total_quantity, total_price) {
// 		const query = `
//             INSERT INTO checkout_items (checkout_id, cart_id, product_id,  total_quantity, total_price)
//             VALUES ($1, $2, $3, $4, $5)
//             RETURNING *;
//         `;

// 		const res = await db.query(query, [checkout_id, cart_id, product_id, total_quantity, total_price]);
// 		return res.rows[0];
// 	},

// 	async findById(id) {
// 		const query = `
//             SELECT * FROM checkout_items
//             WHERE id = $1;
//         `;

// 		const res = db.query(query, [id]);
// 		return res.rows[0];
// 	},

// 	async findByCart(cart_id) {
// 		const query = `
// 			SELECT *
// 			FROM checkout_items
// 			WHERE cart_id = $1;
// 		`;

// 		const res = await db.query(query, [cart_id]);
// 		return res.rows;
// 	},

// 	async findByCheckoutId(checkout_id) {
// 		const query = `
// 			SELECT *
// 			FROM checkout_items
// 			WHERE checkout_id = $1;
// 		`;

// 		const res = await db.query(query, [checkout_id]);
// 		return res.rows;
// 	},

// 	async remove(id) {
// 		const query = `
// 			DELETE FROM checkout_items
// 			WHERE id = $1
// 			RETURNING *;
// 		`;

// 		const res = await db.query(query, [id]);
// 		return res.rows[0];
// 	},
// };

// export default CheckoutItem;
