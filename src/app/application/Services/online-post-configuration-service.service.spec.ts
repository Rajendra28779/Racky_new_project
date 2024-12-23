import { TestBed } from '@angular/core/testing';

import { OnlinePostConfigurationServiceService } from './online-post-configuration-service.service';

describe('OnlinePostConfigurationServiceService', () => {
  let service: OnlinePostConfigurationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlinePostConfigurationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
