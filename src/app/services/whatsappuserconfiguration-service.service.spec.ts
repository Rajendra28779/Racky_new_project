import { TestBed } from '@angular/core/testing';

import { WhatsappuserconfigurationServiceService } from './whatsappuserconfiguration-service.service';

describe('WhatsappuserconfigurationServiceService', () => {
  let service: WhatsappuserconfigurationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsappuserconfigurationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
