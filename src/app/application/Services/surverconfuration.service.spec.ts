import { TestBed } from '@angular/core/testing';

import { SurverconfurationService } from './surverconfuration.service';

describe('SurverconfurationService', () => {
  let service: SurverconfurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurverconfurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
