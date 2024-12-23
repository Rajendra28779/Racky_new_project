import { TestBed } from '@angular/core/testing';

import { SwasthyaMitraReviewreportService } from './swasthya-mitra-reviewreport.service';

describe('SwasthyaMitraReviewreportService', () => {
  let service: SwasthyaMitraReviewreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwasthyaMitraReviewreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
