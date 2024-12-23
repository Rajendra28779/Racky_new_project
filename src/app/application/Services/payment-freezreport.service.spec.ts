import { TestBed } from '@angular/core/testing';

import { PaymentFreezreportService } from './payment-freezreport.service';

describe('PaymentFreezreportService', () => {
  let service: PaymentFreezreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentFreezreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
