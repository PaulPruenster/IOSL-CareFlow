"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const csv_parser_1 = __importDefault(require("csv-parser"));
// Open a connection to the SQLite3 database (or create it if it doesn't exist)
const db = new sqlite3_1.default.Database("./transports.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    }
    else {
        console.log("Connected to the SQLite database.");
    }
});
// Create the table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS transports (
    transportnummer TEXT PRIMARY KEY,
    transportdatum TEXT,
    tranhstart TEXT,
    tranhende TEXT,
    tranvonort TEXT,
    tranvonstrasse TEXT,
    tranbisort TEXT,
    tranbisstrasse TEXT,
    transportart TEXT,
    bezugnr TEXT,
    kmtotale INTEGER,
    fuhrparkklasse TEXT,
    sektionort TEXT
)`, (err) => {
    if (err) {
        console.error("Error creating table:", err.message);
    }
    else {
        console.log("Table created or already exists.");
    }
});
// Function to insert a record into the database
function insertData(row) {
    const query = `INSERT INTO transports (
        transportnummer, transportdatum, tranhstart, tranhende,
        tranvonort, tranvonstrasse, tranbisort, tranbisstrasse,
        transportart, bezugnr, kmtotale, fuhrparkklasse, sektionort
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [
        row.Transportnummer,
        row.Transportdatum,
        row.TRANHSTART,
        row.tranhende,
        row.tranvonort,
        row.tranvonstrasse,
        row.tranbisort,
        row.tranbisstrasse,
        row.Transportart,
        row.BEZUGNR,
        parseInt(row.kmtotale) || 0,
        row.fuhrparkklasse,
        row.Sektionort,
    ], (err) => {
        if (err) {
            console.error("Error inserting data:", err.message);
        }
        else {
            console.log(`Inserted transport: ${row.Transportnummer}`);
        }
    });
}
// Read and parse the CSV file
fs_1.default.createReadStream("../WeisnData/small.csv")
    .pipe((0, csv_parser_1.default)({ separator: ";" })) // Set the delimiter to ';'
    .on("data", (row) => {
    insertData(row);
})
    .on("end", () => {
    console.log("CSV file successfully processed.");
    db.close((err) => {
        if (err) {
            console.error("Error closing database:", err.message);
        }
        else {
            console.log("Database connection closed.");
        }
    });
});
