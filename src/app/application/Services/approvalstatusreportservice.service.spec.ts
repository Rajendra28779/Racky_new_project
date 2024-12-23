import { TestBed } from '@angular/core/testing';

import { ApprovalstatusreportserviceService } from './approvalstatusreportservice.service';

describe('ApprovalstatusreportserviceService', () => {
  let service: ApprovalstatusreportserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovalstatusreportserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
