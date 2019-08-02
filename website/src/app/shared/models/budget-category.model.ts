export class BudgetCategory {
	id: number;
	name: string;
	description: string;
	ar_name?: string;
	en_name?: string;
	en_description?: string;
	ar_description?: string;
}

export enum LUTBudgetCategory {
	OwnBudget = 1,
	SuperEconomy = 2,
	Economy = 3,
	MidRange = 4,
	Splurge = 5,
}
