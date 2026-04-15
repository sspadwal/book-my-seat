import pkg from "pg";
const { Pool } = pkg;

let pool; // global

const dbConnect = async () => {
    pool = new Pool({
        connectionString: process.env.POSTGRE_URI,
    });

    await pool.connect();
    console.log("Connected to PostgreSQL database successfully");
};

export { pool };
export default dbConnect;