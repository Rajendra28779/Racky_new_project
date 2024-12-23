import { TestBed } from '@angular/core/testing';

import { SnaremarkService } from './snaremark.service';

describe('SnaremarkService', () => {
  let service: SnaremarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnaremarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
