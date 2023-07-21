import pg from 'pg';
import 'dotenv/config';

let client;

const connect = async () => {
	try {
		client = new pg.Client({
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		});

		await client.connect();
	} catch (error) {
		console.log(error);
	}
};

export { connect, client };
