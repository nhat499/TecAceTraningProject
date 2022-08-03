const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    multipleStatements: true
});

db.connect((err) => {
    if (err) throw err;
    console.log("connection connected");
})

module.exports = db;