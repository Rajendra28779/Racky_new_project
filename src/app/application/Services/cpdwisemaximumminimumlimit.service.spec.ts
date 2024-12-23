import { TestBed } from '@angular/core/testing';

import { CpdwisemaximumminimumlimitService } from './cpdwisemaximumminimumlimit.service';

describe('CpdwisemaximumminimumlimitService', () => {
  let service: CpdwisemaximumminimumlimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpdwisemaximumminimumlimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
