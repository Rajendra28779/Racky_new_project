import { TestBed } from '@angular/core/testing';

import { SnoFressClaimApprovalService } from './sno-fress-claim-approval.service';

describe('SnoFressClaimApprovalService', () => {
  let service: SnoFressClaimApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnoFressClaimApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
