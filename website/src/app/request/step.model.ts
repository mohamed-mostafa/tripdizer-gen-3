export interface Step {
	key: string;
	title: string;
	value: string;
	path: string;
	order: number;
	isDisabled?: boolean;
	isHiddenOnNavBar?: boolean;
	requiredForEstimateCalc?: boolean;
	requiredForRecommendation?: boolean;
	isValid(): boolean;
	isClickable(): boolean;
}
