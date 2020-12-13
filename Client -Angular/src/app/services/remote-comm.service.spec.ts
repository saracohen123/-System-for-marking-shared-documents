import { TestBed } from '@angular/core/testing';

import { RemoteCommService } from './remote-comm.service';

describe('RemoteCommService', () => {
  let service: RemoteCommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteCommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
