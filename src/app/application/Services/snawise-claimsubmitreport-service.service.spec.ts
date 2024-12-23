import { TestBed } from '@angular/core/testing';

import { SnawiseClaimsubmitreportServiceService } from './snawise-claimsubmitreport-service.service';

describe('SnawiseClaimsubmitreportServiceService', () => {
  let service: SnawiseClaimsubmitreportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnawiseClaimsubmitreportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
