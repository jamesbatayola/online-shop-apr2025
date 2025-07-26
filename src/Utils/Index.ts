import { access } from "fs/promises";
import { constants } from "fs";
import type { Request, Response, NextFunction } from "express";

// check if files exist
async function fileExist(path: string) {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
	if (req.cookies.jwt || req.cookies.user_id) {
		req.isLoggedIn = true;
		return next();
	}

	req.isLoggedIn = false;
	next();
}

export default {
	fileExist,
	isLoggedIn,
};
