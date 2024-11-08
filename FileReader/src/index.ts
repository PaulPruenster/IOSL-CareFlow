import { log } from "console";
import { readCSV } from "./helper/csvReader";
import { Transport } from "./models/transport";
import sqlite3 from "sqlite3";

const filePath = "/home/bzwilaar/hack.worktrees/main/WeisnData/transporte.csv";

const main = async () => {
	try {
		const transports: Transport[] = await readCSV(filePath);
		const db = new sqlite3.Database("iosl.db");
		console.log("Database created");
		db.serialize(() => {
			db.run(`CREATE TABLE IF NOT EXISTS transport (
                transportNumber TEXT,
                transportDate TEXT,
                tranHStart TEXT,
                tranHEnd TEXT,
                tranStartPlace TEXT,
                tranStartStreet TEXT,
                tranDestPlace TEXT,
                tranDestStreet TEXT,
                transportType TEXT,
                refernceNr TEXT,
                kmTotal INTEGER,
                carType TEXT,
                wkSection TEXT
            )`);

			const stmt = db.prepare(`INSERT INTO transport (
                transportNumber,
                transportDate,
                tranHStart,
                tranHEnd,
                tranStartPlace,
                tranStartStreet,
                tranDestPlace,
                tranDestStreet,
                transportType,
                refernceNr,
                kmTotal,
                carType,
                wkSection
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
			var tot = transports.length;
			let i = 0;
			transports.forEach((transport) => {
				i++;
				console.log("Inserting transport " + i + " of " + tot);
				stmt.run(
					transport.transportNumber,
					transport.transportDate,
					transport.tranHStart,
					transport.tranHEnd,
					transport.tranStartPlace,
					transport.tranStartStreet,
					transport.tranDestPlace,
					transport.tranDestStreet,
					transport.transportType,
					transport.refernceNr,
					transport.kmTotal,
					transport.carType,
					transport.wkSection
				);
			});

			stmt.finalize();

			db.each("SELECT TOP(100) * FROM transport", (err, row: any) => {
				console.log(row.id + ": " + JSON.stringify(row));
			});
		});
		db.close(() => {
			console.log("Database connection closed.");
			process.exit(0); // Exit the process with a success code
		});
	} catch (error) {
		console.error("Error reading CSV file:", error);
	}
};

main();
