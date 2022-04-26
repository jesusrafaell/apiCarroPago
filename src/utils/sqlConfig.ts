export const sqlConfig = {
	server: process.env.HOST!,
	database: process.env.DATABASE!,
	user: process.env.NAMEUSER!,
	password: process.env.PASSWORD!,
	requestTimeout: 30000,
	connectionTimeout: 30000,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
};
