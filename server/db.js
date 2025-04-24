import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
// Make sure dotenv is configured early, potentially in index.js or here.
// If index.js already calls dotenv.config(), you might not strictly need it here,
// but calling it again is generally safe and ensures variables are loaded for this module.
dotenv.config();


// const { Pool } = pg;

const dbConfig ={
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_NAME || 'db',
  password: process.env.PG_PASSWORD, // Reads from .env
  port: parseInt(process.env.PG_PORT || '5432', 10),
};

// Optional connection test
// --- Input Validation (Basic) ---
// Crucial check to ensure essential config is present
if (!dbConfig.user || !dbConfig.database || !dbConfig.password) {
  console.error(
    'FATAL ERROR: Missing required database configuration in environment variables.'
  );
  console.error('Please ensure DB_USER, DB_DATABASE, and DB_PASSWORD are set in your .env file.');
  // Optionally exit the process if configuration is missing, as the app cannot function
  // process.exit(1);
} else {
    console.log(`Attempting to connect to database '${dbConfig.database}' on ${dbConfig.host}:${dbConfig.port} as user '${dbConfig.user}'`);
}

// --- Create Connection Pool ---
// Using a Pool is recommended for web applications as it manages multiple connections efficiently.
const pool = new pg.Pool(dbConfig);

// --- Event Listeners for the Pool (Helpful for Debugging) ---
pool.on('connect', (client) => {
  console.log(`Database pool: Client connected (PID: ${client.processID})`);
  // You could potentially set session variables here if needed for all connections:
  // client.query('SET search_path TO my_schema');
});

pool.on('error', (err, client) => {
  console.error('Database pool: Unexpected error on idle client', {
    error: err.message,
    stack: err.stack,
    clientInfo: client ? `Client PID: ${client.processID}` : 'Client info unavailable',
  });
  // Consider application-specific error handling or termination strategy for pool errors
});

// --- Test Connection on Startup (Optional but Recommended) ---
// Attempts a simple query when the module loads to verify connection.
pool.query('SELECT NOW() as now')
  .then(res => {
    console.log(`Database connection test successful. DB Current Time: ${res.rows[0].now}`);
  })
  .catch(err => {
    console.error("Database connection test FAILED:", {
      message: err.message,
      // Avoid logging sensitive parts of the config or full stack in production logs if desired
      configUsed: {
        user: dbConfig.user,
        host: dbConfig.host,
        database: dbConfig.database,
        port: dbConfig.port,
      },
      // stack: err.stack // Uncomment for full stack trace during debugging
    });
    // You might want to exit if the initial connection fails
    // process.exit(1);
  });


// --- Export Query Interface ---
// Expose a query function that uses the connection pool.
// This is the primary way other modules will interact with the database.
export default {
  query: (text, params) => {
    // Simple logging for every query (can be verbose, remove/conditionalize for production)
    // const start = Date.now();
    // console.log('Executing query:', { text, params: params || [] });
    return pool.query(text, params);
    // .then(res => {
    //   const duration = Date.now() - start;
    //   console.log('Executed query', { text, duration_ms: duration, rows: res.rowCount });
    //   return res;
    // })
    // .catch(err => {
    //    console.error('Error executing query', { text, params, error: err.message });
    //    throw err; // Re-throw the error after logging
    // });
  },

  // Optional: If you need to perform transactions (multiple queries that must
  // succeed or fail together), you might expose a method to get a single client
  // from the pool. Remember to release the client back to the pool!
  // getClient: async () => {
  //   const client = await pool.connect();
  //   console.log(`Database pool: Client acquired for transaction (PID: ${client.processID})`);
  //   const query = client.query;
  //   const release = () => {
  //     console.log(`Database pool: Client released (PID: ${client.processID})`);
  //     client.release();
  //   };
  //   // Override the query method to log transactions
  //   client.query = (...args) => {
  //     console.log('Executing transactional query:', args[0]); // Log query text
  //     return query.apply(client, args);
  //   };
  //   // Add helper methods for transaction control
  //   client.doBegin = () => client.query('BEGIN');
  //   client.doCommit = () => client.query('COMMIT');
  //   client.doRollback = () => client.query('ROLLBACK');
  //
  //   return { client, release }; // Return both client and release function
  // }
  // Usage for transactions:
  // const { client, release } = await db.getClient();
  // try {
  //   await client.doBegin();
  //   await client.query('INSERT...', values1);
  //   await client.query('UPDATE...', values2);
  //   await client.doCommit();
  // } catch (e) {
  //   await client.doRollback();
  //   throw e;
  // } finally {
  //   release(); // VERY IMPORTANT TO RELEASE THE CLIENT
  // }
};