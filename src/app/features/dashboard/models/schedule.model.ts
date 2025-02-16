export interface Schedule {
    id: bigint;
    day: number;
    startHour: number;
    endHour: number;
    courseName: string;
    isActive: boolean;
}

export type NewSchedule = Omit<Schedule, 'id' | 'isActive'| 'courseName'>;