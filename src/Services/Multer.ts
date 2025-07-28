import multer from "multer";

// __diranem & __filename
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from "path";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "..", "Public", "img"));
	},

	filename: (req, file, cb) => {
		const timestamp = Date.now();
		const safe_name = file.originalname.replace(/\s+/g, "-"); // replace spaces
		cb(null, `${timestamp}-${safe_name}`);
	},
});

const fileFilter = (req: any, file: any, cb: any) => {
	const allowed_types = ["image/jpeg", "image/png"];
	if (allowed_types.includes(file.mimetype)) {
		cb(null, true); // accept file
	} else {
		cb(new Error("Invalid file type"));
	}
};

const upload = multer({
	storage,
	fileFilter,
});

export default upload;
