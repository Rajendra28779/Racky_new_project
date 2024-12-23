import { TestBed } from '@angular/core/testing';

import { TreatementSupportUrnserviceService } from './treatement-support-urnservice.service';

describe('TreatementSupportUrnserviceService', () => {
  let service: TreatementSupportUrnserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatementSupportUrnserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
