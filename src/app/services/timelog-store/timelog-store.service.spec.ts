import { TestBed } from '@angular/core/testing';

import { TimelogStore } from './timelog-store.service';

describe('TimelogStoreService', () => {
  let service: TimelogStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelogStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
