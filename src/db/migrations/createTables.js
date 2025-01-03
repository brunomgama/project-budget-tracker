const db = require('../database');

db.serialize(() => {
    // Project table
    db.run(`
      CREATE TABLE IF NOT EXISTS project (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

    // Manager table
    db.run(`
      CREATE TABLE IF NOT EXISTS manager (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

    // Budget table
    db.run(`
      CREATE TABLE IF NOT EXISTS budget (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        totalamount REAL NOT NULL,
        projectid INTEGER NOT NULL,
        categoryid INTEGER NOT NULL,
        FOREIGN KEY (projectid) REFERENCES project (id) ON DELETE CASCADE
      );
    `);

    // Category table
    db.run(`
      CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

    // Expense table
    db.run(`
      CREATE TABLE IF NOT EXISTS expense (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        budgetid INTEGER NOT NULL,
        categoryid INTEGER NOT NULL,
        FOREIGN KEY (budgetid) REFERENCES budget (id) ON DELETE CASCADE
      );
    `);

    console.log('Tables created (if not already existing).');
});
