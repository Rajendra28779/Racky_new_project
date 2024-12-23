import { TestBed } from '@angular/core/testing';

import { WebcommonservicesService } from './webcommonservices.service';

describe('WebcommonservicesService', () => {
  let service: WebcommonservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebcommonservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
