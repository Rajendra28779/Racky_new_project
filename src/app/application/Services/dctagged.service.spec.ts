import { TestBed } from '@angular/core/testing';

import { DctaggedService } from './dctagged.service';

describe('DctaggedService', () => {
  let service: DctaggedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DctaggedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
