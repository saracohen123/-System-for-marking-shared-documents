import { TestBed } from '@angular/core/testing';

import { AllDocumentService } from './all-document.service';

describe('AllDocumentService', () => {
  let service: AllDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
