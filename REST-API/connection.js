// const { Client } = import("pg");
import pg from "pg";
const { Client } = pg;
import * as dotenv from "dotenv";
dotenv.config();
const client = new Client({
    host: "localhost",
    user: "admin",
    port: 5432,
    password: process.env.PASSWORD,
    database: "postgres",
});

export default client;
