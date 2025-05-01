module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'vibrant',
  synchronize: false,
  logging: true,
  entities: ['server/models/**/*.ts'],
  migrations: ['server/migrations/**/*.ts'],
  migrationsTableName: 'migrations_history',
  cli: {
    entitiesDir: 'server/models',
    migrationsDir: 'server/migrations'
  }
} 