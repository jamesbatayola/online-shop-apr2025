import { access } from "fs/promises";
import { constants } from "fs";

// check if files exist
async function fileExist(path) {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

export default {
	fileExist,
};
