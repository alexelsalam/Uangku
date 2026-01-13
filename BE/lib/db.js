import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();
let pool;

if (!global._pgPool) {
  global._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

pool = global._pgPool;

export default pool;
