export interface StreakData {
    count: number;
    lastActiveDate: string;
    isTodayActive: boolean;
    history: {
        date: string;
        active: boolean;
    }[];
}

export interface StreakLevel {
    min: number;
    max: number;
    label: string;
    color: string;
    animationSource: string | object;
}
