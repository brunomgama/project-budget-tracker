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

    // ProjectManager linking table
    db.run(`
      CREATE TABLE IF NOT EXISTS projectmanager (
        projectid INTEGER NOT NULL,
        managerid INTEGER NOT NULL,
        PRIMARY KEY (projectid, managerid),
        FOREIGN KEY (projectid) REFERENCES project (id) ON DELETE CASCADE,
        FOREIGN KEY (ManagerId) REFERENCES manager (id) ON DELETE CASCADE
      );
    `);

    // Budget table
    db.run(`
      CREATE TABLE IF NOT EXISTS budget (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        totalamount REAL NOT NULL,
        projectid INTEGER NOT NULL,
        FOREIGN KEY (projectid) REFERENCES project (id) ON DELETE CASCADE
      );
    `);

    // Category table
    db.run(`
      CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT,
        projectid INTEGER,
        FOREIGN KEY (projectid) REFERENCES project (id) ON DELETE CASCADE
      );
    `);

    // BudgetCategory linking table
    db.run(`
      CREATE TABLE IF NOT EXISTS budgetcategory (
        budgetid INTEGER NOT NULL,
        categoryid INTEGER NOT NULL,
        PRIMARY KEY (budgetid, categoryid),
        FOREIGN KEY (budgetid) REFERENCES budget (id) ON DELETE CASCADE,
        FOREIGN KEY (categoryid) REFERENCES category (id) ON DELETE CASCADE
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
        FOREIGN KEY (budgetid) REFERENCES budget (id) ON DELETE CASCADE
      );
    `);

    // ExpenseCategory linking table
    db.run(`
      CREATE TABLE IF NOT EXISTS expensecategory (
        expenseid INTEGER NOT NULL,
        categoryid INTEGER NOT NULL,
        PRIMARY KEY (expenseid, categoryid),
        FOREIGN KEY (expenseid) REFERENCES expense (id) ON DELETE CASCADE,
        FOREIGN KEY (categoryid) REFERENCES category (id) ON DELETE CASCADE
      );
    `);

    console.log('Tables created (if not already existing).');
});
