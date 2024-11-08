import { readCSV } from "./helper/csvReader";
import { Transport } from "./models/transport";

const filePath = "/home/bzwilaar/hack.worktrees/main/WeisnData/transporte.csv";

let a: string = "Hello, World!";
console.log(a);
const main = async () => {
	try {
		const transports: Transport[] = await readCSV(filePath);
		//console.log(transports);
	} catch (error) {
		console.error("Error reading CSV file:", error);
	}
};

main();

console.log(a);
