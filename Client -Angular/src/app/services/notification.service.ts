import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { RemoteCommService } from './remote-comm.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public commService: RemoteCommService) { }

  Notify(docId: number, msg: string, freedraw?) {
    var obs = this.commService.UpdateDocument(docId, msg);
    obs.pipe(
      map((response: any) => {
        console.log(response)
      })
    ).subscribe(
        code => console.log(code))
  }
}
