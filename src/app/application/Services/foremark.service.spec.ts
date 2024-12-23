import { TestBed } from '@angular/core/testing';

import { ForemarkService } from './foremark.service';

describe('ForemarkService', () => {
  let service: ForemarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForemarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
