
export enum Currency {
    USD = 'USD',
    KHR = 'KHR'
}

export interface ChangeBreakdown {
    khr: number;
}

export interface ChangeCalculation {
    totalKhr: number;
    totalUsd: number;
    insufficient: number;
    breakdown: ChangeBreakdown | null;
}
