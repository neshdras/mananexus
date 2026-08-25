const pg = require('pg')
const { Pool } = pg
require('dotenv').config()
const connectionString = process.env.DATABASE_URI
const pool = new Pool({
    connectionString,
})

const query = (text, params) => {
    return pool.query(text, params)
}

module.exports = {query}