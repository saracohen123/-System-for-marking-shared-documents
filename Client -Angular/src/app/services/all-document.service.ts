import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteCommService } from './remote-comm.service';
import {Document} from '../models/Document';
import { UserRequest } from '../models/UserRequest';

@Injectable({
  providedIn: 'root'
})
export class AllDocumentService {
  constructor(private commService: RemoteCommService) { }
  responses = {
    ResponseListDocument: new Subject<any>(),
    ResponseErr: new Subject<any>()
  }

  DocsIParticipateIn(user: UserRequest) {
    var obs = this.commService.DocsIParticipateIn(user);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) =>{
        responses.next(res)}
    
    )
  }

    GetAllDocumentsForUser(User: any) {
      var obs = this.commService.GetAllDocumentsForUser(User);
      var obs2 = obs.pipe(
        map(res => [this.responses[res.responseType], res])
      );
      obs2.subscribe(
        ([responses, res]) =>{
          responses.next(res)}
      )
  }

  onResponseListDocument(): Subject<any> {
    return this.responses.ResponseListDocument
  }
  onResponseErr(): Subject<any> {
    return this.responses.ResponseErr
  }


}
