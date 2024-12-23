import { TestBed } from '@angular/core/testing';

import { MnthWiseDischargeMeService } from './mnth-wise-discharge-me.service';

describe('MnthWiseDischargeMeService', () => {
  let service: MnthWiseDischargeMeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MnthWiseDischargeMeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
