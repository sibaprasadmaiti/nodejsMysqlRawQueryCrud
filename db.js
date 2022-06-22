const mysql = require('mysql2');

//database conntection
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simple_nodejs_crud',
    port: 3306
});

//check database connection
db.connect(err => {
    if (err) {
        console.log(err, 'dberr');
    } else {
        console.log('Database connected...');
    }
})

module.exports.db = db;