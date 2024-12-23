import { TestBed } from '@angular/core/testing';

import { UsermanualService } from './usermanual.service';

describe('UsermanualService', () => {
  let service: UsermanualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermanualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
