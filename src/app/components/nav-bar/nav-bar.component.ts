import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { TimelogStore } from 'src/app/services/timelog-store/timelog-store.service';

/**
 * Top bar component inside of the side menu. Manages Profile information and settings
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnDestroy {

  // Debouncer to avoid user keyboard spam
  private dailyHoursDebounceSubject = new Subject<string>();
  private weeklyHoursDebounceSubject = new Subject<string>();

  private subscriptionList: Subscription[] = [];

  constructor(
    public authService: AuthService,
    public timelogStore: TimelogStore,
    public config: ConfigService,
  ) {
    this.subscriptionList.push(
      // Subscriptions to manage the debounce time of the inputs for the daily and weekly hours input
      this.dailyHoursDebounceSubject.pipe(debounceTime(500)).subscribe(hours => {
        const hoursNumber = Number(hours);
        this.timelogStore.updateTotalTimePercentage(hoursNumber);
        this.config.dailyHours = hoursNumber;
      }),
      this.weeklyHoursDebounceSubject.pipe(debounceTime(500)).subscribe(hours => {
        const hoursNumber = Number(hours);
        this.config.weeklyHours = hoursNumber;
      }),
    );
  }

  public ngOnDestroy() {
    this.subscriptionList.forEach(subscription => subscription?.unsubscribe());
  }

  /**
   * Toggles the visibility of the timelogs (and save the settings)
   */
  public toggleWeekend(value: boolean) {
    this.timelogStore.setWeekendsVisibility(value);
    this.config.weekendsIncluded = value;
  }

  public changeDailyHours(value: string) {
    this.dailyHoursDebounceSubject.next(value);
  }

  public changeWeeklyHours(value: string) {
    this.weeklyHoursDebounceSubject.next(value);
  }
}
