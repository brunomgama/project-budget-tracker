import db from '../database.js';

db.serialize(() => {
    // Insert sample data into Project table
    db.run(`
        INSERT OR IGNORE INTO project (name, managerid) VALUES
            ('Infrastructure Upgrade', 1),
            ('Client Onboarding System', 1),
            ('Internal Training Initiative', 2),
            ('Marketing Expansion Campaign', 1),
            ('Cybersecurity Enhancement', 2);
    `);

    // Insert sample data into Manager table
    db.run(`
        INSERT OR IGNORE INTO manager (name) VALUES
            ('Bruno Gama'),
            ('Alice Johnson'),
            ('Catherine Lee'),
            ('Daniel Brown');
    `);

    // Insert sample data into Category table
    db.run(`
        INSERT OR IGNORE INTO category (name) VALUES
            ('Consultancy'),
            ('Software Licenses'),
            ('Operations'),
            ('Business Travel'),
            ('Marketing Materials'),
            ('Employee Training'),
            ('Hardware Purchases'),
            ('Security Audits');
    `);

    // Insert sample data into Budget table
    db.run(`
        INSERT OR IGNORE INTO budget (name, totalamount, projectid, categoryid) VALUES
            ('Infrastructure Budget', 75000, 1, 7),
            ('Software Subscriptions', 30000, 2, 2),
            ('Employee Workshops', 12000, 3, 6),
            ('Campaign Advertising', 45000, 4, 5),
            ('External Security Audits', 40000, 5, 8),
            ('Travel Expenses', 10000, 4, 4);
    `);

    // Insert sample data into Expense table
    db.run(`
        INSERT OR IGNORE INTO expense (amount, description, date, budgetid, categoryid) VALUES
                                                                                            -- January
            (1500.00, 'Network switches and routers', '2025-01-05', 1, 7),
            (2000.00, 'Software license renewal', '2025-01-10', 2, 2),
            (18000.00, 'Google Ads Campaign - January Push', '2025-01-15', 4, 5),

                                                                                            -- February
            (800.00, 'Conference room rental for training', '2025-02-02', 3, 6),
            (1200.00, 'Print brochures for February event', '2025-02-10', 4, 5),
            (950.00, 'Hotel stay for conference', '2025-02-12', 6, 4),

                                                                                            -- March
            (3000.00, 'Penetration testing for Q1', '2025-03-08', 5, 8),
            (500.00, 'User training platform subscription', '2025-03-20', 3, 6),
            (1500.00, 'Additional social media ad spend', '2025-03-27', 4, 5),

                                                                                            -- April
            (2500.00, 'New firewall installation', '2025-04-05', 1, 7),
            (1800.00, 'External audit for Q1', '2025-04-10', 5, 8),

                                                                                            -- May
            (750.00, 'Updated training content', '2025-05-03', 3, 6),
            (2000.00, 'Business trip to client office', '2025-05-15', 6, 4),
            (1700.00, 'Video production for campaign', '2025-05-20', 4, 5),

                                                                                            -- June
            (2200.00, 'Server maintenance fees', '2025-06-10', 1, 7),
            (3000.00, 'Data protection audit', '2025-06-25', 5, 8),
            (1900.00, 'New security software', '2025-06-30', 5, 8),

                                                                                            -- July
            (1500.00, 'Recruitment event catering', '2025-07-07', 3, 6),
            (2200.00, 'International travel expense', '2025-07-12', 6, 4),
            (2500.00, 'End-of-campaign analysis video', '2025-07-22', 4, 5);
    `);

    console.log('Sample data inserted successfully.');
});
{}