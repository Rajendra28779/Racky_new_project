import { TestBed } from '@angular/core/testing';

import { HosphavingzerodoctservService } from './hosphavingzerodoctserv.service';

describe('HosphavingzerodoctservService', () => {
  let service: HosphavingzerodoctservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HosphavingzerodoctservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
