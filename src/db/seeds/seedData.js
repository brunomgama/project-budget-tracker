const db = require('../database');

db.serialize(() => {
    // Insert sample data into Project table
    db.run(`
        INSERT INTO project (name) VALUES
            ('Project Alpha');
    `);

    // Insert sample data into Manager table
    db.run(`
        INSERT INTO manager (name) VALUES
            ('Alice Smith');
    `);

    // Insert sample data into ProjectManager linking table
    db.run(`
        INSERT OR IGNORE INTO projectmanager (projectid, managerid) VALUES
            (1, 1);
    `);

    // Insert sample data into Budget table
    db.run(`
        INSERT INTO budget (name, totalamount, projectid) VALUES
            ('Alpha Budget', 50000, 1),
            ('Beta Budget', 10000, 1),
            ('Gamma Budget', 250, 1);
    `);

    // Insert sample data into Category table
    db.run(`
        INSERT INTO category (name, color, projectid) VALUES
            ('Consultancy', 'blue', 1);
    `);

    // Insert sample data into BudgetCategory linking table
    db.run(`
        INSERT OR IGNORE INTO budgetcategory (budgetid, categoryid) VALUES
            (1, 1);
    `);

    // Insert sample data into Expense table
    db.run(`
        INSERT INTO expense (amount, description, date, budgetid) VALUES
            (1500.23, 'Initial consultancy fee', '2025-01-02', 1),
            (2000.12, 'Initial consultancy fee', '2025-01-02', 1);
    `);

    // Insert sample data into ExpenseCategory linking table
    db.run(`
        INSERT OR IGNORE INTO expensecategory (expenseid, categoryid) VALUES
            (1, 1);
    `);

    console.log('Sample data inserted.');
});
