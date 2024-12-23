import { TestBed } from '@angular/core/testing';

import { OldandnewclaimdetailsService } from './oldandnewclaimdetails.service';

describe('OldandnewclaimdetailsService', () => {
  let service: OldandnewclaimdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OldandnewclaimdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
