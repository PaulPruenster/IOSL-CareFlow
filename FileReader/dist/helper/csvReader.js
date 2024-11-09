"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parse_1 = require("csv-parse");
const readCSV = (filePath) => {
    console.log("Reading CSV file:", filePath);
    return new Promise((resolve, reject) => {
        const transports = [];
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parse_1.parse)({ delimiter: ";", columns: true }))
            .on("data", (row) => {
            const [day, month, year] = row.Transportdatum.split(".").map(Number);
            const [startHour, startMinute] = row.TRANHSTART.split(":").map(Number);
            const [endHour, endMinute] = row.tranhende.split(":").map(Number);
            const transport = {
                transportNumber: row.Transportnummer,
                transportDate: new Date(Date.UTC(year, month - 1, day)),
                tranHStart: new Date(Date.UTC(year, month - 1, day, startHour, startMinute)),
                tranHEnd: new Date(Date.UTC(year, month - 1, day, endHour, endMinute)),
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
            }
            else {
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
exports.readCSV = readCSV;
