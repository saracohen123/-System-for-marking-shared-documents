import { TestBed } from '@angular/core/testing';

import { CreatedocumentService } from './createdocument.service';

describe('CreatedocumentService', () => {
  let service: CreatedocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatedocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
