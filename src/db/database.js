const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Resolve the path to the SQLite database file.
const dbPath = path.resolve(process.cwd(), 'src/db/budget_tracker.db');

// Create and establish a connection to the SQLite database.
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Export the database connection object for use in other parts of the application.
module.exports = db;
