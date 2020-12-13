import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RemoteCommService } from './remote-comm.service'
import { map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {
  responses = {
    ResponseOK: new Subject<any>(),
    ResponseMistakeDetails: new Subject<any>(),
    ResponseErr: new Subject<any>()
  }

  constructor(private commService: RemoteCommService) { }

  Register(value: any) {
    var obs = this.commService.Register(value);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) => responses.next(res)
      , err => this.responses.ResponseErr.next(err)
    )
  }


  onResponseOK(): Subject<any> {
    return this.responses.ResponseOK
  }


  onResponseMistakeDetails(): Subject<any> {
    return this.responses.ResponseMistakeDetails
  }

  onResponseErr(): Subject<any> {
    return this.responses.ResponseErr
  }












}
