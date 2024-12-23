import { TestBed } from '@angular/core/testing';

import { HospitaldoctorprofileserviceService } from './hospitaldoctorprofileservice.service';

describe('HospitaldoctorprofileserviceService', () => {
  let service: HospitaldoctorprofileserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitaldoctorprofileserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
