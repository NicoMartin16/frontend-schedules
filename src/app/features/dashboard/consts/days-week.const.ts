export const DAYS_WEEK = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
} as const;

export type DaysWeek = typeof DAYS_WEEK[keyof typeof DAYS_WEEK];

export type DAYS_WEEK_TYPE = keyof typeof DAYS_WEEK;

export const DAYS_WEEK_ARRAY = Object.entries(DAYS_WEEK).map(([value, label]) => ({ value: Number(value), label }));