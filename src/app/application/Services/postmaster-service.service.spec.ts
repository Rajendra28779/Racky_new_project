import { TestBed } from '@angular/core/testing';

import { PostmasterServiceService } from './postmaster-service.service';

describe('PostmasterServiceService', () => {
  let service: PostmasterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostmasterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
