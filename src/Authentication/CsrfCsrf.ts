import { doubleCsrf } from "csrf-csrf";

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
	getSecret: () => "csrf-token-secret",
	getSessionIdentifier: (req) => req.cookies.user_id,
	getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
	cookieName: "__Host-psifi.x-csrf-token",
	cookieOptions: {
		sameSite: "lax",
		path: "/",
		secure: true,
		httpOnly: true,
	},
	size: 32,
	ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

export default {
	generateCsrfToken,
	doubleCsrfProtection,
};
