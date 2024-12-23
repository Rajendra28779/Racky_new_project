import { TestBed } from '@angular/core/testing';

import { PartiallfloatserviceService } from './partiallfloatservice.service';

describe('PartiallfloatserviceService', () => {
  let service: PartiallfloatserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartiallfloatserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
