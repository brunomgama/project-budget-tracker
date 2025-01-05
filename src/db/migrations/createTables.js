import db from '../database.js';

// Serialize ensures the SQL commands are executed sequentially.
db.serialize(() => {
    // Create the Project table if it does not already exist.
    db.run(`
        CREATE TABLE IF NOT EXISTS project (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        );
    `);

    // Create the Manager table if it does not already exist.
    db.run(`
        CREATE TABLE IF NOT EXISTS manager (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        );
    `);

    // Create the Budget table if it does not already exist.
    db.run(`
        CREATE TABLE IF NOT EXISTS budget (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        totalamount REAL NOT NULL,
        projectid INTEGER NOT NULL,
        categoryid INTEGER NOT NULL,
        FOREIGN KEY (projectid) REFERENCES project (id) ON DELETE RESTRICT,
        FOREIGN KEY (categoryid) REFERENCES category (id) ON DELETE RESTRICT
        );
    `);

    // Create the Category table if it does not already exist.
    db.run(`
        CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        );
    `);

    // Create the Expense table if it does not already exist.
    db.run(`
        CREATE TABLE IF NOT EXISTS expense (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        budgetid INTEGER NOT NULL,
        categoryid INTEGER NOT NULL,
        FOREIGN KEY (budgetid) REFERENCES budget (id) ON DELETE RESTRICT,
        FOREIGN KEY (categoryid) REFERENCES category (id) ON DELETE RESTRICT
        );
    `);

    // Create indexes for optimization of frequent queries.
    db.run(`CREATE INDEX IF NOT EXISTS idx_budget_projectid ON budget (projectid);`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_expense_budgetid ON expense (budgetid);`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_expense_categoryid ON expense (categoryid);`);

    console.log('Tables created (if not already existing) and indexes added.');
});
