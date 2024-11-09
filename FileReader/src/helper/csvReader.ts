import fs from "fs";
import { parse } from "csv-parse";
import { Transport } from "../models/transport";

export const readCSV = (filePath: string): Promise<Transport[]> => {
	console.log("Reading CSV file:", filePath);
	return new Promise((resolve, reject) => {
		const transports: Transport[] = [];
		fs.createReadStream(filePath)
			.pipe(parse({ delimiter: ";", columns: true }))
			.on("data", (row) => {
				const [day, month, year] = row.Transportdatum.split(".").map(Number);
				const [startHour, startMinute] = row.TRANHSTART.split(":").map(Number);
				const [endHour, endMinute] = row.tranhende.split(":").map(Number);

				const transport: Transport = {
					transportNumber: row.Transportnummer,
					transportDate: new Date(Date.UTC(year, month - 1, day)), // Create Date object in UTC
					tranHStart: new Date(Date.UTC(year, month - 1, day, startHour, startMinute)), // Create Date object in UTC
					tranHEnd: new Date(Date.UTC(year, month - 1, day, endHour, endMinute)), // Create Date object in UTC
					tranStartPlace: row.tranvonort,
					tranStartStreet: row.tranvonstrasse,
					tranDestPlace: row.tranbisort,
					tranDestStreet: row.tranbisstrasse,
					transportType: row.Transportart,
					refernceNr: row.BEZUGNR,
					kmTotal: parseInt(row.kmtotale, 10),
					carType: row.fuhrparkklasse,
					wkSection: row.Sektionort,
				};
				if (isNaN(transport.tranHEnd.getTime())) {
					console.log("Invalid tranHEnd date:", row.tranhende);
				} else {
					transports.push(transport);
				}
			})
			.on("end", () => {
				resolve(transports);
			})
			.on("error", (error) => {
				reject(error);
			});
	});
};
