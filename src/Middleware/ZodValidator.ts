const validate = (schema) => {
	return (req, res, next) => {
		const validation_result = schema.safeParse(req.body);

		if (!validation_result.success) {
			const err = new Error("Validation error");
			err.statusCode = 400;
			err.data = validation_result.error.flatten().fieldErrors;
			return next(err);
		}

		next();
	};
};

export default validate;
