import { TestBed } from '@angular/core/testing';

import { EmpanelmentmasterserviceService } from './empanelmentmasterservice.service';

describe('EmpanelmentmasterserviceService', () => {
  let service: EmpanelmentmasterserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpanelmentmasterserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
