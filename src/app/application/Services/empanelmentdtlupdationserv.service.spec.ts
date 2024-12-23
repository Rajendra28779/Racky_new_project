import { TestBed } from '@angular/core/testing';

import { EmpanelmentdtlupdationservService } from './empanelmentdtlupdationserv.service';

describe('EmpanelmentdtlupdationservService', () => {
  let service: EmpanelmentdtlupdationservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpanelmentdtlupdationservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
