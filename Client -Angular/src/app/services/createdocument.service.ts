import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteCommService } from './remote-comm.service';

@Injectable({
  providedIn: 'root'
})
export class CreatedocumentService {

  responses = {
    ResponseMistakeDetails: new Subject<any>(),
    ResponseErr: new Subject<any>(),
    ResponseDocumentId: new Subject<any>(),
    ResponseUploaded: new Subject<any>()
  }

  constructor(private commService: RemoteCommService) { }

  createdocument(value: any) {
    var obs = this.commService.creaedocument(value);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )
  }
  UploadImg(fileToUpload: any, value) {
    var obs = this.commService.UploadImg(fileToUpload, value);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )

  }

  onResponseDocumentId(): Subject<any> {
    return this.responses.ResponseDocumentId
  }
  onResponseMistakeDetails(): Subject<any> {
    return this.responses.ResponseMistakeDetails
  }
  onResponseErr(): Subject<any> {
    return this.responses.ResponseErr
  }
  onResponseUploaded(): Subject<any> {
    return this.responses.ResponseUploaded
  }
}
