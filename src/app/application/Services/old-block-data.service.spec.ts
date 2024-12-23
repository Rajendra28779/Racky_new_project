import { TestBed } from '@angular/core/testing';

import { OldBlockDataService } from './old-block-data.service';

describe('OldBlockDataService', () => {
  let service: OldBlockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OldBlockDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
