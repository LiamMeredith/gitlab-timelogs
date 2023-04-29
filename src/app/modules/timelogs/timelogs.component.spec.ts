import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelogsComponent } from './timelogs.component';

describe('TimelogsComponent', () => {
  let component: TimelogsComponent;
  let fixture: ComponentFixture<TimelogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
