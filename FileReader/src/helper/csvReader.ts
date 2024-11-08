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
				const transport: Transport = {
					transportNumber: row.Transportnummer,
					transportDate: row.Transportdatum,
					tranHStart: row.TRANHSTART,
					tranHEnd: row.tranhende,
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
				transports.push(transport);
			})
			.on("end", () => {
				resolve(transports);
			})
			.on("error", (error) => {
				reject(error);
			});
	});
};
