import { TestBed } from '@angular/core/testing';

import { FacilityDetailServiceService } from './facility-detail-service.service';

describe('FacilityDetailServiceService', () => {
  let service: FacilityDetailServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilityDetailServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
