import { TestBed } from '@angular/core/testing';

import { PackagewisedischargeclaimService } from './packagewisedischargeclaim.service';

describe('PackagewisedischargeclaimService', () => {
  let service: PackagewisedischargeclaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackagewisedischargeclaimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
