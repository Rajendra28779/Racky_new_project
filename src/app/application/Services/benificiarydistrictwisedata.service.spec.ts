import { TestBed } from '@angular/core/testing';

import { BenificiarydistrictwisedataService } from './benificiarydistrictwisedata.service';

describe('BenificiarydistrictwisedataService', () => {
  let service: BenificiarydistrictwisedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BenificiarydistrictwisedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
