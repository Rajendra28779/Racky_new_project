import { TestBed } from '@angular/core/testing';

import { CreategroupservicdeService } from './creategroupservicde.service';

describe('CreategroupservicdeService', () => {
  let service: CreategroupservicdeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreategroupservicdeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
