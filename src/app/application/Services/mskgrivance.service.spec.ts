import { TestBed } from '@angular/core/testing';

import { MskgrivanceService } from './mskgrivance.service';

describe('MskgrivanceService', () => {
  let service: MskgrivanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MskgrivanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
