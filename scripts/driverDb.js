const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'drivers.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to SQLite database');
});

// Create drivers table
const createTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS drivers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT,
            driver_name TEXT NOT NULL,
            driver_id_towbook INTEGER NOT NULL,
            UNIQUE(driver_name, driver_id_towbook)
        )
    `;
    
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

// Insert a single driver
const insertDriver = (driver) => {
    const query = `
        INSERT OR REPLACE INTO drivers (uid, driver_name, driver_id_towbook)
        VALUES (?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
        db.run(query, [driver.uid, driver.driver_name, driver.driver_id_towbook], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// Insert multiple drivers
const insertDrivers = async (drivers) => {
    try {
        await createTable();
        for (const driver of drivers) {
            await insertDriver(driver);
        }
        console.log('All drivers inserted successfully');
    } catch (err) {
        console.error('Error inserting drivers:', err);
    }
};

// Get all drivers
const getAllDrivers = () => {
    const query = 'SELECT * FROM drivers';
    
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

// Get driver by towbook ID
const getDriverByTowbookId = (towbookId) => {
    const query = 'SELECT * FROM drivers WHERE driver_id_towbook = ?';
    
    return new Promise((resolve, reject) => {
        db.get(query, [towbookId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

// Close database connection
const closeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Database connection closed');
            resolve();
        });
    });
};

module.exports = {
    insertDrivers,
    getAllDrivers,
    getDriverByTowbookId,
    closeDatabase
};
