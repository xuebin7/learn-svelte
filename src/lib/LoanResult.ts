export interface LoanResult {
	debxResult: Detail,
	debjResult: Detail
}

export interface Detail {
	totalInterest: string,
	details: Item[]
}

export interface Item {
	n: number;
	monthTotal: string;
	monthMoney: string;
	monthInterest: string;
	restMoney: string;
}
