require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: 'mysql-3dc3d72e-garciacj735-1de1.d.aivencloud.com',
    user: 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: 'defaultdb',
    port: '12840'
});

db.connect((err) => {
    if (err) {
        console.log('Database connection failed');
        console.log(err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    db.query('SELECT 1', (err) => {
        if (err) {
            res.send('Database connection failed');
        } else {
            res.send('Database Connected Successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});