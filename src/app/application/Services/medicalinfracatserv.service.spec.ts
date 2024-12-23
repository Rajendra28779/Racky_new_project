import { TestBed } from '@angular/core/testing';

import { MedicalinfracatservService } from './medicalinfracatserv.service';

describe('MedicalinfracatservService', () => {
  let service: MedicalinfracatservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalinfracatservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
