export function getWeekDays(day: Date, weekendIncluded = true): Date[] {
  const week: Date[] = [];
  const firstDayDifference = day.getDay() - 1 === -1 ? 6 : day.getDay() - 1;
  day.setDate(day.getDate() - firstDayDifference);
  for (let i = 0; i < (weekendIncluded ? 7 : 5); i++) {
    week.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  return week;
}

export function getCurrentWeek(): Date[] {
  return getWeekDays(new Date());
}

export function secondsToHms(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 3600 % 60);

  const hDisplay = h > 0 ? h + (h === 1 ? ' hour,' : ' hours,') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute,' : ' minutes,') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second,' : ' seconds,') : '';
  return [hDisplay, mDisplay].join(' ').trim().slice(0, -1);
}
