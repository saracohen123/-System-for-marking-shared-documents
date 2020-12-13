import { TestBed } from '@angular/core/testing';

import { CanNavigateService } from './can-navigate.service';

describe('CanNavigateService', () => {
  let service: CanNavigateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanNavigateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
