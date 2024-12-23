import { TestBed } from '@angular/core/testing';

import { ManagedduplicatedbenificiaryService } from './managedduplicatedbenificiary.service';

describe('ManagedduplicatedbenificiaryService', () => {
  let service: ManagedduplicatedbenificiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagedduplicatedbenificiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
