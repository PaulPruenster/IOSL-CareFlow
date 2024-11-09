const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./transports.db');

// Function to retrieve transports within a 3-hour window on a given date
function getTransportsWithin3Hours(date: any, startTime: any) {
    const query = `
        SELECT * FROM transports
        WHERE Transportdatum = ?
        AND TRANHSTART >= ?
        AND TRANHSTART <= time(?, '+3 hours')
    `;

    db.all(query, [date, startTime, startTime], (err: any, rows: any) => {
        if (err) {
            console.error('Error fetching data:', err.message);
        } else if (rows.length === 0) {
            console.log(`No transports found for date ${date} within 3 hours starting at ${startTime}.`);
        } else {
            console.log(`Transports on ${date} within 3 hours from ${startTime}:`);
            rows.forEach((row: any) => {
                console.log(row);
            });
        }
    });
}

// Example usage
getTransportsWithin3Hours('03.11.2024', '11:00');

// Close the database connection
db.close((err: any) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
