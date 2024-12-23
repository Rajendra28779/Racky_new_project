import { TestBed } from '@angular/core/testing';

import { OutOfPocketExpenditureServiceService } from './out-of-pocket-expenditure-service.service';

describe('OutOfPocketExpenditureServiceService', () => {
  let service: OutOfPocketExpenditureServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutOfPocketExpenditureServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
