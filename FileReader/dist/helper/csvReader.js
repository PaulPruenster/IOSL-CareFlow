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
            const transport = {
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
exports.readCSV = readCSV;
