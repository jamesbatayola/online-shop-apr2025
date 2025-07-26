import type { User } from "@prisma/client";
import type { File as MulterFile } from "multer";

declare module "express-serve-static-core" {
	interface Request {
		user?: User;
		file?: MulterFile;
	}
}
