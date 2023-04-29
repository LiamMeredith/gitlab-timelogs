import { Timelog } from './timelog.model';

export class TimelogGroup implements TimelogGroupInterface {
  public totalSeconds: number;
  public totalSecondsPercentageDay: number; // Divides between 8h to know the completes hours in a day
  public totalSecondsDisplay: string; // User friendly text
  public dayOfTheWeek: string;
  public id: string;
  public timelogs: Timelog[];

  constructor(data: TimelogGroupInterface) {
    this.totalSeconds = data.totalSeconds ?? 0;
    this.id = data.id ?? null;
    this.timelogs = data.timelogs ?? [];
  }

  public static createFromApi(data: any = {}): TimelogGroup {
    return new TimelogGroup({
      totalSeconds: data.totalSeconds,
      id: data.id,
      timelogs: data.timelogs,
    });
  }

  public addTimelog(timelog: Timelog) {
    this.timelogs.push(timelog);
  }
}

export interface TimelogGroupInterface {
  totalSeconds: number;
  id: string;
  timelogs: Timelog[];
}
