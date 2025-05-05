import { z } from "zod";

const UserSchema = z.object({
	name: z.string().nonempty({ message: "Name required" }),

	email: z
		.string()
		.nonempty({ message: "Email required" })
		.min(11, { message: "Email requires 11 minimum characters" })
		.max(64, { message: "Email requires 64 maximum characters" })
		.trim()
		.email({ message: "Invalid email" }),

	password: z.string().nonempty({ message: "Password required" }).min(4, { message: "Password required 4 minimum characters" }),
});

export default UserSchema;
