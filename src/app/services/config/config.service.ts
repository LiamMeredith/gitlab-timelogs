import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private datastore: Config = {
    weekendsIncluded: this.retrieveField('weekendsIncluded', Boolean) as boolean ?? false,
    dailyHours: this.retrieveField('dailyHours', Number) as number ?? 8,
    weeklyHours: this.retrieveField('weeklyHours', Number) as number ?? 40,
  }

  private weekendsIncludedSubject = new BehaviorSubject<boolean>(this.datastore.weekendsIncluded);
  public weekendsIncluded$ = this.weekendsIncludedSubject.asObservable();

  private dailyHoursSubject = new BehaviorSubject<number>(this.datastore.dailyHours);
  public dailyHours$ = this.dailyHoursSubject.asObservable();

  private weeklyHoursSubject = new BehaviorSubject<number>(this.datastore.weeklyHours);
  public weeklyHours$ = this.weeklyHoursSubject.asObservable();

  constructor() { }

  private retrieveField(key: string, type: any) {
    const found = localStorage.getItem(key);
    if (found) {
      switch (type) {
        case Boolean:
          return found === 'true';
        case Number:
          return Number(found);
        default:
          return null;
      }
    }
    return null;
  }

  public get weekendsIncluded(): boolean {
    return this.datastore.weekendsIncluded;
  }

  public set weekendsIncluded(value: boolean) {
    this.datastore.weekendsIncluded = value;
    this.weekendsIncludedSubject.next(value);
    localStorage.setItem('weekendsIncluded', value + '');
  }

  public get dailyHours(): number {
    return this.datastore.dailyHours;
  }

  public set dailyHours(value: number) {
    this.datastore.dailyHours = value;
    this.dailyHoursSubject.next(value)
    localStorage.setItem('dailyHours', String(value));
  }

  public get weeklyHours(): number {
    return this.datastore.weeklyHours;
  }

  public set weeklyHours(value: number) {
    this.datastore.weeklyHours = value;
    this.weeklyHoursSubject.next(value);
    localStorage.setItem('weeklyHours', String(value));
  }
}

interface Config {
  weekendsIncluded: boolean,
  dailyHours: number,
  weeklyHours: number,
}
