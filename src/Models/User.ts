// /* eslint-disable no-undef */

// import client from "../Database/Index.js";
// import bcrypt from "bcryptjs";

// const User = {
// 	async create(email, name, password) {
// 		// contains sql constrait
// 		try {
// 			const res = await client.query(
// 				`
// 				INSERT INTO users (email, name, password)
// 				VALUES ($1, $2, $3)
// 				RETURNING *;
// 			`,
// 				[email, name, password]
// 			);

// 			return res.rows[0];
// 		} catch (err) {
// 			if (err.code === "23505") {
// 				const conflictError = new Error("User already exists");
// 				conflictError.statusCode = 409;
// 				throw conflictError;
// 			}

// 			throw err;
// 		}
// 	},

// 	async findAll() {
// 		const res = await client.query(`SELECT * FROM users;`);
// 		return res.rows;
// 	},

// 	async findById(id) {
// 		const res = await client.query(`SELECT * FROM users WHERE id = $1;`, [id]);

// 		if (res.rows.length === 0) {
// 			const notFoundError = new Error("User not found");
// 			notFoundError.statusCode = 404;
// 			throw notFoundError;
// 		}

// 		return res.rows[0];
// 	},

// 	// async getCart(user_id) {
// 	//   const user_cart = await client.query(
// 	//     `SELECT * FROM carts WHERE user_id = $1`,
// 	//     [user_id]
// 	//   );
// 	// },

// 	async findByEmail(email) {
// 		const res = await client.query(`SELECT * FROM users WHERE email = $1;`, [email]);

// 		if (res.rows.length === 0) {
// 			const notFoundError = new Error("User not found");
// 			notFoundError.statusCode = 404;
// 			throw notFoundError;
// 		}

// 		return res.rows[0];
// 	},

// 	async findOrCreate(profile) {
// 		let user;

// 		const res = await client.query(`SELECT * FROM users WHERE email = $1;`, [profile.emails[0].value]);

// 		if (res.rows.length === 0) {
// 			user = await this.create(profile.emails[0].value, profile.displayName, await bcrypt.hash(process.env.DEFAULT_OAUTH_PASSWORD, 10));
// 		} else {
// 			user = res.rows[0];
// 		}

// 		return user;
// 	},

// 	async changePassword(id, new_password) {
// 		const res = await client.query(
// 			`
// 			UPDATE users
// 			SET password = $1
// 			WHERE id = $2
// 			RETURNING *;
//       	`,
// 			[new_password, id]
// 		);

// 		return res.rows[0];
// 	},

// 	async isCreated(email) {
// 		try {
// 			await this.findByEmail(email);
// 			return true;
// 		} catch {
// 			return false;
// 		}
// 	},
// };

// export default User;
