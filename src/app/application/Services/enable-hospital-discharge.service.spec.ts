import { TestBed } from '@angular/core/testing';

import { EnableHospitalDischargeService } from './enable-hospital-discharge.service';

describe('EnableHospitalDischargeService', () => {
  let service: EnableHospitalDischargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnableHospitalDischargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
