import { TestBed } from '@angular/core/testing';

import { ExpiredBeneficiaryRptService } from './expired-beneficiary-rpt.service';

describe('ExpiredBeneficiaryRptService', () => {
  let service: ExpiredBeneficiaryRptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpiredBeneficiaryRptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
