import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();
declare global {
  var _pgPool: InstanceType<typeof Pool> | undefined;
}

let pool: InstanceType<typeof Pool>;
if (!global._pgPool) {
  global._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

pool = global._pgPool;

export default pool;
