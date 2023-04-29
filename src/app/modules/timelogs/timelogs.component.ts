import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimelogGroup } from 'src/app/models/timelog-group.model';
import { TimelogType } from 'src/app/models/timelog-type.enum';
import { WeekDays } from 'src/app/models/week.enums';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { TimelogStore } from 'src/app/services/timelog-store/timelog-store.service';

/**
 * Main grid of timelogs separated in days of a week
 */
@Component({
  selector: 'app-timelogs',
  templateUrl: './timelogs.component.html',
  styleUrls: ['./timelogs.component.scss']
})
export class TimelogsComponent implements OnInit, OnDestroy {

  public WeekDays = WeekDays;
  public TimelogType = TimelogType;
  public weekTimeLogs: Record<string, TimelogGroup> = {};
  public week: string[];

  public timelogsLoading = false;

  private subcriptionList: Subscription[] = [];

  constructor(
    private timelogStore: TimelogStore,
    private auth: AuthService,
    private config: ConfigService,
  ) { }

  public ngOnInit() {
    this.timelogStore.initStore(
      this.auth.getUsername(),
      null,
      this.config.weekendsIncluded,
      this.config.dailyHours,
    );

    this.subcriptionList.push(
      this.timelogStore.loading$.subscribe(loading => this.timelogsLoading = loading),
      this.timelogStore.timelogs$.subscribe(timelogs => this.weekTimeLogs = timelogs),
      this.timelogStore.week$.subscribe(week => this.week = week),
    );
  }

  public ngOnDestroy() {
    this.subcriptionList.forEach(subscription => subscription.unsubscribe());
  }

  public previousWeek() {
    this.timelogStore.selectPreviousWeek();
  }

  public nextWeek() {
    this.timelogStore.selectNextWeek();
  }
}
