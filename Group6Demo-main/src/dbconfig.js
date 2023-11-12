const port = process.env.PORT || 4000;
process.env.DATABASE_URL = "postgres://bdpqmoxsvcynfg:1614154c11d897edcdbe81faa8140df8f58e8b2a7ca4a11d18cc7c51152ef437@ec2-52-4-104-184.compute-1.amazonaws.com:5432/dfshas5t53psm6"

const Pool = require('pg').Pool
var connectionParams = null;
if (process.env.DATABASE_URL != null) {
    connectionParams = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }
} else {
    connectionParams = {

        host: 'localhost',
        user: 'api_user',
        password: 'password',
        port: 5432,
        database: 'api'
    }
}

const pool = new Pool(connectionParams)

module.exports = pool;