import { TestBed } from '@angular/core/testing';

import { TaggingHistoryServiceService } from './tagging-history-service.service';

describe('TaggingHistoryServiceService', () => {
  let service: TaggingHistoryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaggingHistoryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
