import { TestBed } from '@angular/core/testing';

import { OldclmprocessblockrprtService } from './oldclmprocessblockrprt.service';

describe('OldclmprocessblockrprtService', () => {
  let service: OldclmprocessblockrprtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OldclmprocessblockrprtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
