export interface Step {
    key: string;
    title: string;
    value: string;
    path: string;
    order: number;
    isHiddenInNavBar?: boolean;
    requiredForEstimateCalc?: boolean;
    requiredForRecommendation?: boolean;
    isValid(): boolean;
}
