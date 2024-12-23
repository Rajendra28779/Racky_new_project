import { TestBed } from '@angular/core/testing';

import { HospitalspecialityreportserviceService } from './hospitalspecialityreportservice.service';

describe('HospitalspecialityreportserviceService', () => {
  let service: HospitalspecialityreportserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalspecialityreportserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
