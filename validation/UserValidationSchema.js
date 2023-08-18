import { object, string, date } from 'yup';

export default object({
	username: string()
		.required('A Username is Required')
		.lowercase()
		.min(1)
		.max(50)
		.matches(/^[a-z0-9_-]+$/i),
	password: string()
		.required('A Password is Required')
		.min(8)
		.max(72)
		.matches(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@$!%*?&_-]).{8,72}$/,
			'Password must be between 8-72 characters, including a number, an uppercase letter, a lowercase letter, and a special character.'
		)
		.typeError('Invalid Password'),
	email: string()
		.required('An Email is Required')
		.email('Invalid Email Address')
		.lowercase()
		.typeError('Invalid Email'),
	birthday: date('Invalid Date').required('A Birthday is Required').typeError('Invalid Date'),
});
