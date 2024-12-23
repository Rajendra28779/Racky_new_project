import { TestBed } from '@angular/core/testing';

import { DcCdmomappingService } from './dc-cdmomapping.service';

describe('DcCdmomappingService', () => {
  let service: DcCdmomappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DcCdmomappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
