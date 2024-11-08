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
Object.defineProperty(exports, "__esModule", { value: true });
const csvReader_1 = require("./helper/csvReader");
const filePath = "/home/bzwilaar/hack.worktrees/main/WeisnData/transporte.csv";
let a = "Hello, World!";
console.log(a);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transports = yield (0, csvReader_1.readCSV)(filePath);
        console.log(transports);
    }
    catch (error) {
        console.error("Error reading CSV file:", error);
    }
});
main();
console.log(a);
