import mysql from 'mysql2/promise';
import { configDotenv } from 'dotenv';

configDotenv();

const con = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

con.connect((error) => {
    if (error) {
        console.error("CONNECTION ERROR : %o ", error);
    } else {
        console.log("DB Connected");
    }
})

export default con;
