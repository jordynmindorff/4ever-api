import { object, string, date } from 'yup';

export default object({
	username: string()
		.required()
		.lowercase()
		.min(1)
		.max(50)
		.matches(/^[a-z0-9_-]+$/i),
	password: string()
		.required()
		.min(8)
		.max(72)
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_]{8,72}$/),
	email: string().required().email().lowercase(),
	birthday: date().required(),
});
