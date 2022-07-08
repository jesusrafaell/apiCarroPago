export default {
	type: 'mssql',
	host: process.env.HOST,
	database: process.env.DATABASE,
	username: process.env.NAMEUSER,
	password: process.env.PASSWORD,
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
	requestTimeout: 30000000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/models/**/*.ts'],
	migrations: ['src/db/base/**/*.ts'],
	subscribers: ['src/db/subscriber/**/*.ts'],
	cli: {
		entitiesDir: 'src/db/models',
		migrationsDir: 'src/db/base',
		subscribersDir: 'src/db/subscriber',
	},
};
