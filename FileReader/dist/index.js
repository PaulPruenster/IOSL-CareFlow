"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvReader_1 = require("./helper/csvReader");
const sqlite3_1 = __importDefault(require("sqlite3"));
const filePath = "/home/bzwilaar/hack.worktrees/main/WeisnData/transporte.csv";
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transports = yield (0, csvReader_1.readCSV)(filePath);
        const db = new sqlite3_1.default.Database("iosl.db");
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
                stmt.run(transport.transportNumber, transport.transportDate, transport.tranHStart, transport.tranHEnd, transport.tranStartPlace, transport.tranStartStreet, transport.tranDestPlace, transport.tranDestStreet, transport.transportType, transport.refernceNr, transport.kmTotal, transport.carType, transport.wkSection);
            });
            stmt.finalize();
            db.each("SELECT TOP(100) * FROM transport", (err, row) => {
                console.log(row.id + ": " + JSON.stringify(row));
            });
        });
        db.close(() => {
            console.log("Database connection closed.");
            process.exit(0); // Exit the process with a success code
        });
    }
    catch (error) {
        console.error("Error reading CSV file:", error);
    }
});
main();
