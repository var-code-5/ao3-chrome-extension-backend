import pg from "pg";
import env from "dotenv";

env.config();

const db = new pg.Client({
  user: process.env.REMOTE_DB_USER,
  host: process.env.REMOTE_DB_HOST,
  database: process.env.REMOTE_DB_NAME,
  password: process.env.REMOTE_DB_PASSWORD,
  port: process.env.REMOTE_DB_PORT,
});

db.connect();

export default db;
