import pool from '../config/db.js';

/**
 * GET /api/health
 * Returns HTTP status 200 and JSON server status message
 */
export const getHealth = (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "FleetHub backend is running",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/health/db
 * Simple database connection test query
 * Executes SELECT NOW(), current_database(), and counts public schema tables
 */
export const getDbHealth = async (req, res, next) => {
  try {
    // 1. Connection & timestamp test query
    const dbResult = await pool.query('SELECT NOW() AS current_time, current_database() AS database_name;');
    
    // 2. Public tables count query
    const tableCountResult = await pool.query(
      "SELECT COUNT(*)::int AS table_count FROM information_schema.tables WHERE table_schema = 'public';"
    );

    return res.status(200).json({
      success: true,
      message: "Successfully connected to FleetHub PostgreSQL database",
      database: dbResult.rows[0].database_name,
      serverTime: dbResult.rows[0].current_time,
      tablesCount: tableCountResult.rows[0].table_count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to connect to FleetHub PostgreSQL database",
      error: error.message,
    });
  }
};
