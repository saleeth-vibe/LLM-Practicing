const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const shared = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'campus_ai',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  logging: false
};

module.exports = {
  development: shared,
  test: shared,
  production: shared
};
