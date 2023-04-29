import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { filter, map, skip, take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config/config.service';
import { TimelogStore } from 'src/app/services/timelog-store/timelog-store.service';
import { secondsToHms } from 'src/app/utils/date.util';

/**
 * Side menu that contains the nav bar and the footer
 * Manages the calendar picker and total hours in a week display
 */
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  // Date picker to selecte new dates
  @ViewChild('datePicker') datePicker: NgbDatepicker;

  // State of the current selected week for the UX in the date picker
  public selectedDays: any;

  // Information needed to display selected week total hours
  public totalSecondsPercentageWeek: number;
  public totalWeekTimeDisplay: string;

  private subscriptionList: Subscription[] = [];

  constructor(
    public timelogStore: TimelogStore,
    public config: ConfigService,
  ) { }

  ngOnInit(): void {
    this.subscriptionList.push(
      this.getWeeklyHours(),
      this.getSelectedWeek(),
      this.listenToConfigWeeklyHours(),
    )
  }

  public ngOnDestroy() {
    this.subscriptionList.forEach(subscription => subscription?.unsubscribe());
  }

  /**
   * Subscription of the current hours of the week
   */
  private getWeeklyHours(): Subscription {
    return this.updateWeekHoursObservable().subscribe();
  }

  /**
   * Retrieves the weekly hours on config update
   */
  private listenToConfigWeeklyHours(): Subscription {
    return this.config.weeklyHours$.pipe(skip(1)).subscribe(() => this.updateWeekHoursObservable().pipe(take(1)).subscribe());
  }

  /**
   * Retrieves the current hours of the week
   */
  private updateWeekHoursObservable(): Observable<void> {
    return this.timelogStore.timelogs$
      .pipe(
        map(response => Object.values(response).map(timelog => timelog.totalSeconds).reduce((partialSum, a) => partialSum + a, 0)),
        map(totalWeekTime => {
          this.totalWeekTimeDisplay = secondsToHms(totalWeekTime);
          this.totalSecondsPercentageWeek = totalWeekTime / (this.config.weeklyHours * 36);
        })
      );
  }

  /**
   * Retrieves and stores the selected week to print in the calendar
   */
  private getSelectedWeek(): Subscription {
    return this.timelogStore.entireWeek$.pipe(
      filter(response => !!response?.length)
    ).subscribe(week => {
      this.selectedDays = {};
      if (week.length > 0) {
        week.forEach((day, index) => {
          const splittedDay = day.split('/');
          if(splittedDay[0].charAt(0) === '0')
          {
            splittedDay[0] = splittedDay[0].substring(1);
          }
          if(splittedDay[1].charAt(0) === '0')
          {
            splittedDay[1] = splittedDay[1].substring(1);
          }
          if (index === 0) {
            this.datePicker?.navigateTo({
              year: Number(splittedDay[2]),
              month: Number(splittedDay[1]),
              day: Number(splittedDay[0]),
            });
          }

          this.selectedDays[splittedDay.join('')] = true;
        });
      }
    })
  }

  /**
   * listens to date picker component to select a new date
   */
  public selectDate(date: NgbDate) {
    this.timelogStore.selecetDate(new Date(date.year, date.month - 1, date.day));
  }
}
