import type { User } from "@prisma/client";
import type { Request } from "express";

export default interface HttpRequest extends Request {
	user: User;
}
