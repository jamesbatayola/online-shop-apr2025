// import bcrypt from "bcryptjs";

// const salt = await bcrypt.genSalt(10);
// const hash = await bcrypt.hash("1234", salt);

// console.log(hash);

import { z } from "zod";

const user = z.object({
	name: z.string().nonempty({ message: "Name required" }),
	age: z.number().int(),
});

const res = user.safeParse({
	name: "",
	age: "",
});

if (res.success) {
	console.log({
		success: true,
	});
} else {
	console.log({
		success: false,
		error: res.error.flatten().fieldErrors,
	});
}
