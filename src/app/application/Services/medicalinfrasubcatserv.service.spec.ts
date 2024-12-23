import { TestBed } from '@angular/core/testing';

import { MedicalinfrasubcatservService } from './medicalinfrasubcatserv.service';

describe('MedicalinfrasubcatservService', () => {
  let service: MedicalinfrasubcatservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalinfrasubcatservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
