export type FileType = {
	id: string;
	fileName: string;
	fullName: string;
	timestamp: Date;
	downloadURL: string;
	type: string;
	size: number;
};
export type Plan = {
	title: string;
	price: string;
	description: string;
	features: string[];
	forSale: boolean;
};
