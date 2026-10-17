import pg from 'pg';

const { Pool } = pg;

/**
 * PostgreSQL Connection Pool Configuration
 * Configured consistently using standard DATABASE_URL connection string.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper query function for executing parameterized SQL
export const query = (text, params) => pool.query(text, params);

export default pool;
