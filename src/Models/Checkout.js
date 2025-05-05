import client from "../Database/Index.js";

const Checkout = {
	async create(cart_id) {
		const query = `
            INSERT INTO checkouts (cart_id)
            VALUES ($1)
            RETURNING *;
        `;
		const res = await client.query(query, [cart_id]);
		return res.rows[0];
	},

	async findById(id) {
		const query = `
            SELECT * FROM checkouts
            WHERE id = $1;
        `;
		const res = await client.query(query, [id]);
		return res.rows[0];
	},

	async findByCart(cart_id) {},

	// TODO:

	// async findOrCreate(cart_id) {
	// 	const checkout = await this.findById(id);

	// 	if (checkout) {
	// 		return checkout;
	// 	}

	// 	return this.create(cart_id);
	// },
};

export default Checkout;
