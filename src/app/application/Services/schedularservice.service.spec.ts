import { TestBed } from '@angular/core/testing';

import { SchedularserviceService } from './schedularservice.service';

describe('SchedularserviceService', () => {
  let service: SchedularserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedularserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
