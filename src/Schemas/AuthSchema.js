import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().trim().nonempty({ message: "Email required" }).toLowerCase().email({ message: "Invalid email" }),
	password: z.string().nonempty({ message: "Password required" }),
});

export const SignupScheme = z
	.object({
		name: z.string().nonempty({ message: "Name required" }),

		email: z
			.string()
			.trim()
			.nonempty({ message: "Email required" })
			.toLowerCase()
			.email({ message: "Invalid email" })
			.min(11, { message: "Email requires 11 minimum characters" })
			.max(84, { message: "Email requires 84 maximum characters" }),

		password: z.string().nonempty({ message: "Password required" }).min(4, { message: "Password requires 4 minimum characters" }),

		confirm_password: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirm_password) {
			ctx.addIssue({
				path: ["confirmPassword"],
				message: "Password do not match",
				code: "custom",
			});
		}
	});
