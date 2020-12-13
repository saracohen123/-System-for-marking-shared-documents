import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { RemoteCommService } from './remote-comm.service';

@Injectable({
  providedIn: 'root'
})
export class LogInService {
  constructor(public remotecomm: RemoteCommService) { }
  responses = {
    ResponseOK: new Subject<any>(),
    ResponseUserNotExist: new Subject<any>(),
    ResponseErr: new Subject<any>()
  }

  LogIn(user: User) {
    var obs = this.remotecomm.LogIn(user);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(([responses, res]) => {
      responses.next(res)
    })
  }

  OnResponseOK(){
    return this.responses.ResponseOK;
  }

  OnResponseErr(){
    return this.responses.ResponseErr;
  }

  OnResponseUserNotExist(){
    return this.responses.ResponseUserNotExist;
  }


}
