export enum Transportart {
	LIEGE = "LIEGE",
	STUHL = "STUHL",
	ROLLSTUHL = "ROLLSTUHL",
	KANN_GEHEN = "KANN GEHEN",
}

export interface Transport {
	transportNumber: string;
	transportDate: string;
	tranHStart: string;
	tranHEnd: string;
	tranStartPlace: string;
	tranStartStreet: string;
	tranDestPlace: string;
	tranDestStreet: string;
	transportType: string;
	refernceNr: string;
	kmTotal: number;
	carType: string;
	wkSection: string;
}
