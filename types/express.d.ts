import "express";
import type { User } from "@prisma/client";
import type { File as MulterFile } from "multer";
import type { CsrfTokenGeneratorRequestUtil } from "csrf-csrf";

declare module "express-serve-static-core" {
	interface Request {
		user?: User;
		file?: MulterFile;
	}
}
