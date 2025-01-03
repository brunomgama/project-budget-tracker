const db = require('../database');

db.serialize(() => {
    // Insert sample data into Project table
    db.run(`
        INSERT INTO project (name) VALUES
            ('Project Alpha'),
            ('Project Beta'),
            ('Project Gamma'),
            ('Project Delta'),
            ('Project Epsilon'),
            ('Project Zeta'),
            ('Project Theta'),
            ('Project Sigma'),
            ('Project Omega'),
            ('Project Nova'),
            ('Project Eclipse'),
            ('Project Zenith'),
            ('Project Horizon'),
            ('Project Aurora'),
            ('Project Titan'),
            ('Project Apex'),
            ('Project Orbit'),
            ('Project Fusion'),
            ('Project Vertex'),
            ('Project Radiant'),
            ('Project Vanguard');
    `);

    // Insert sample data into Manager table
    db.run(`
        INSERT INTO manager (name) VALUES
            ('Alice Smith');
    `);

    // Insert sample data into Budget table
    db.run(`
        INSERT INTO budget (name, totalamount, projectid, categoryid) VALUES
            ('Alpha Budget', 50000, 1, 1),
            ('Beta Budget', 10000, 1, 1),
            ('Gamma Budget', 250, 1, 1);
    `);

    // Insert sample data into Category table
    db.run(`
        INSERT INTO category (name) VALUES
            ('Consultancy');
    `);

    // Insert sample data into Expense table
    db.run(`
        INSERT INTO expense (amount, description, date, budgetid, categoryid) VALUES
            (1500.23, 'Initial consultancy fee', '2025-01-02', 1, 1),
            (2000.12, 'Initial consultancy fee', '2025-01-02', 1, 1);
    `);

    console.log('Sample data inserted.');
});
