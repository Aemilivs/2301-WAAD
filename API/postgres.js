require('dotenv').config();
const { Pool } = require('pg');
const connectionString = JSON.parse(process.env.POSTGRES);
const pool = new Pool(connectionString);

pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
  )
`)
  .then(() => console.log('Users table created successfully'))
  .catch((error) => console.error('Error creating users table', error));

module.exports = {
    query: (query, parameters) => pool.query(query, parameters)
}