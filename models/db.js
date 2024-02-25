const mysql = require('mysql2/promise');

// Database connection
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'employeedb',
    connectionLimit: 10,
});

module.exports = connection;
