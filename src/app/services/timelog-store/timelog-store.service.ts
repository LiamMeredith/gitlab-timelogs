import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TimelogGroup } from 'src/app/models/timelog-group.model';
import { getCurrentWeek, getWeekDays, secondsToHms } from 'src/app/utils/date.util';
import { GitlabService } from '../gitlab/gitlab.service';

@Injectable({
  providedIn: 'root'
})
export class TimelogStore {

  private datastore: {
    groupTimelog: Record<string, TimelogGroup>,
    week: string[],
    entireWeek: string[],
    selectedWeek: Date[],
    username: string,
    weekendsIncluded: boolean,
    timelogsLoading: boolean
  } = {
      groupTimelog: {},
      week: [],
      entireWeek: [],
      selectedWeek: [],
      username: '',
      weekendsIncluded: false,
      timelogsLoading: true,
    };

  private timelogsSubject = new BehaviorSubject(this.datastore.groupTimelog);
  public timelogs$ = this.timelogsSubject.asObservable();

  private weekSubject = new BehaviorSubject(this.datastore.week);
  public week$ = this.weekSubject.asObservable();

  private entireWeekSubject = new BehaviorSubject(this.datastore.entireWeek);
  public entireWeek$ = this.entireWeekSubject.asObservable();

  private loadingSubject = new BehaviorSubject(this.datastore.timelogsLoading);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private gitlabService: GitlabService,
  ) { }

  /**
   * Main functionality to set values in the store
   */
  public initStore(
    username: string,
    selectedDate: Date = null,
    weekendsIncluded = false,
    dailyHours = 8,
  ) {
    this.flush();
    this.datastore.username = username;
    this.datastore.weekendsIncluded = weekendsIncluded;
    this.datastore.selectedWeek = selectedDate ? getWeekDays(selectedDate) : getCurrentWeek();

    this.findWeekDays();
    this.retrieveWeekTimelogs(dailyHours);
  }

  private findWeekDays() {
    this.datastore.selectedWeek.forEach((day, index) => {
      const id = day.toLocaleDateString('en-GB');
      this.datastore.entireWeek.push(id);

      if (index > 4 && this.datastore.weekendsIncluded === false) {
        return;
      }
      this.datastore.week.push(id);
      this.datastore.groupTimelog[id] = TimelogGroup.createFromApi({ id: day });
      this.datastore.groupTimelog[id].dayOfTheWeek = day.toLocaleDateString('en-GB', { weekday: 'long' });
    });
  }

  private retrieveWeekTimelogs(dailyHours: number) {
    this.gitlabService.getTimelogs({
      username: this.datastore.username,
      startDate: this.datastore.week[0],
      endDate: this.datastore.week[this.datastore.week.length - 1],
    }).subscribe(timelogs => {
      timelogs.forEach(timelog => {
        this.datastore.groupTimelog[timelog.spentAt].addTimelog(timelog);
      });
      // Calculate total hours spent
      Object.entries(this.datastore.groupTimelog).forEach(([key, groupTimelog]) => {
        if (groupTimelog.timelogs.length > 0) {
          groupTimelog.totalSeconds = groupTimelog.timelogs.map(timelog => timelog.timeSpent).reduce((a, b) => a + b, 0);
          groupTimelog.totalSecondsPercentageDay = dailyHours !== 0 ? groupTimelog.totalSeconds / (dailyHours * 36) : 0;
          groupTimelog.totalSecondsDisplay = secondsToHms(groupTimelog.totalSeconds);
        }
      });
      this.weekSubject.next(this.datastore.week);
      this.entireWeekSubject.next(this.datastore.entireWeek);
      this.timelogsSubject.next(this.datastore.groupTimelog);
      this.updateLoadingState(false);
    });
  }

  public updateTotalTimePercentage(hours: number) {
    Object.entries(this.datastore.groupTimelog).forEach(([key, groupTimelog]) => {
      if (groupTimelog.timelogs.length > 0) {
        groupTimelog.totalSecondsPercentageDay = hours !== 0 ? groupTimelog.totalSeconds / (hours * 36) : 0;
      }
    });
    this.timelogsSubject.next(this.datastore.groupTimelog);
  }

  public selecetDate(date: Date) {
    this.updateLoadingState(true);
    this.initStore(this.datastore.username, date);
  }

  public selectPreviousWeek() {
    this.updateLoadingState(true);
    const firstWeekDay = this.datastore.selectedWeek[0];
    this.initStore(
      this.datastore.username,
      new Date(firstWeekDay.getTime() - 7 * 24 * 60 * 60 * 1000),
      this.datastore.weekendsIncluded,
    );
  }

  public selectNextWeek() {
    this.updateLoadingState(true);
    const firstWeekDay = this.datastore.selectedWeek[0];
    this.initStore(
      this.datastore.username,
      new Date(firstWeekDay.getTime() + 7 * 24 * 60 * 60 * 1000),
      this.datastore.weekendsIncluded,
    );
  }

  public setWeekendsVisibility(value: boolean) {
    this.updateLoadingState(true);
    this.datastore.weekendsIncluded = value;
    this.initStore(
      this.datastore.username,
      new Date(this.datastore.selectedWeek[0]),
      this.datastore.weekendsIncluded,
    );
  }

  private updateLoadingState(loading: boolean) {
    this.datastore.timelogsLoading = loading;
    this.loadingSubject.next(loading);
  }

  private flush() {
    this.datastore = {
      groupTimelog: {},
      week: [],
      entireWeek: [],
      selectedWeek: [],
      username: '',
      weekendsIncluded: false,
      timelogsLoading: false,
    };
  }
}
