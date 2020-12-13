import { ElementRef, Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { buffer, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { MarkerImage } from '../models/MarkerImage';
import { Document } from '../models/Document';
import { RemoteCommService } from './remote-comm.service';
import { ShareDocument } from "../models/ShareDocument"
import { NotificationService } from './notification.service';
class point {
  constructor(public X, public Y) { }
  add(pt: point): point {
    return new point(this.X + pt.X, this.Y + pt.Y)
  }
  div(denom: number): point {
    return new point(this.X / denom, this.Y / denom)
  }

}
@Injectable(
  //   {
  //   // providedIn: 'root'
  // }
)
export class DrawingService {
  ResponseFunc = {
    "update": (docid) => { this.GetMarkers(docid) },
    // "freedraw": (drawObject) => this.FreeDraw(drawObject)
  }

  UpdateText(currentmarker: MarkerImage) {
    var obs = this.commService.UpdateText(currentmarker);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    )
    obs2.subscribe(
      ([responses, res]) => {
        if (this.DoUpdate(res)) {
          this.notificationSer.Notify(currentmarker.docID, "update")
        }
        responses.next(res);
      }
    )
  }


  AddUsers(shareringUser) {
    var obs = this.commService.AddUsers(shareringUser);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    )
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )
  }

  GetSharedUsers(docid: number) {
    var obs = this.commService.GetSharedUsers(docid);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    )
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )
  }

  GetUsers() {
    var obs = this.commService.GetUsers();
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    )
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )
  }
  RemoveShareUsers(sharingUser: ShareDocument[]) {
    var obs = this.commService.RemoveShareUsers(sharingUser);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    )
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )
  }


  ifExistInSharing(docid: number) {
    var obs = this.commService.ifExistInSharing(docid);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )
  }



  private _subject: Observable<any>;
  StartSocket(docid: number) {
    this._subject = this.commService.StartSocket(docid)
    this._subject.pipe(
      map((response: any) => JSON.parse(response.data))
    ).
      subscribe(
        code => {
          sessionStorage.setItem("statusDocument", "update document");
          this.ResponseFunc[code](docid)
        }
      )
  }


  responses = {
    ResponseOK: new Subject<any>(),
    ResponseMistakeDetails: new Subject<any>(),
    ResponseErr: new Subject<any>(),
    ResponseMarkerAdd: new Subject<any>(),
    ResponseDocument: new Subject<any>(),
    ResponseListMarkers: new Subject<any>(),
    ResponseIfShared: new Subject<any>(),
    ResponseListUsers: new Subject<any>(),
    ResponseSharedUsers: new Subject<any>(),
    ResponseDelMarker: new Subject<any>(),
    ResponseDelAllMarkersDoc: new Subject<any>(),
    ResponseUsersAdded: new Subject<any>(),
  }
  shapeCanvas: ElementRef;
  drawingCanvas: ElementRef;
  foreColor: string = "black"

  setForeColor(color: string) {
    this.foreColor = color
  }

  setDrawMode(drawingMode: string) {
    this.drawingMode = drawingMode;
  }

  constructor(public commService: RemoteCommService, public notificationSer: NotificationService) { }
  freeDrawSubject$ = new Subject<{ fromX: number, fromY: number, toX: number, toY: number }>()
  drawEllipseSubject$ = new Subject<any>()
  drawRectSubject$ = new Subject<any>()

  clickLocationSubject$ = new Subject<any>();

  click(mouseDown$) {
    var obs$ = mouseDown$.pipe(filter(() => this.drawingMode == "del" || this.drawingMode == "text"),
      map((evt: any) => this.getCoordinates(evt))
    )
    obs$.subscribe((objectCoord: { varx: number, vary: number }) => {
      this.clickLocationSubject$.next(objectCoord)

    }
    )
  }

  getCoordinates(evt) {
    var rect = this.shapeCanvas.nativeElement.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    return { varx: x, vary: y }
  }

  drawingMode = "ellipse"
  freeDrawEvents(mouseUp$, mouseMove$, mouseDown$) {
    var drawing$ = mouseDown$.pipe(filter(() => this.drawingMode == "rectengle" || this.drawingMode == "ellipse"),
      switchMap(evt => mouseMove$.pipe(
        takeUntil(mouseUp$)
      )
      )
    )
    var obs$ = drawing$.pipe(
      map((evt: MouseEvent) => this.freeDrawGeometry(evt))
    )
    obs$.subscribe((freeDrawObject: { fromX: number, fromY: number, toX: number, toY: number }) => {
      this.freeDrawSubject$.next(freeDrawObject)
    })

    var poly$ = this.freeDrawSubject$.pipe(
      buffer(mouseUp$)
    )


    var shape$ = poly$.pipe(
      map(poly => this.createShape(poly))
    )
    shape$.subscribe(shape => {
      if (shape) {
        this.drawingMode == "ellipse" ?
          this.drawEllipseSubject$.next(shape) :
          this.drawRectSubject$.next(shape)
      }
    }
    )

  }

  Init(drawingCanvas: ElementRef, shapeCanvas: ElementRef) {
    this.drawingCanvas = drawingCanvas
    this.shapeCanvas = shapeCanvas;
    var canvas = this.drawingCanvas.nativeElement
    var mouseUp$ = fromEvent(canvas, "mouseup")
    var mouseDown$ = fromEvent(canvas, "mousedown")
    var mouseMove$ = fromEvent(canvas, "mousemove")
    this.freeDrawEvents(mouseUp$, mouseMove$, mouseDown$)
    this.click(mouseDown$);
  }



  createShape(poly): { cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string } {
    var shapePoly = poly.map(elemObj => new point(elemObj.toX, elemObj.toY))
    if (shapePoly.length > 0) {
      var center = new point(0, 0)
      center = shapePoly.reduce((acc, pt) => acc.add(pt))
      center = center.div(shapePoly.length)
      var radius = new point(0, 0)
      radius = shapePoly.reduce((acc, pt) => acc.add(new point(Math.abs(pt.X - center.X), Math.abs(pt.Y - center.Y))))
      radius = radius.div(shapePoly.length)
      return {
        cx: center.X, cy: center.Y,
        radiusx: radius.X, radiusy: radius.Y,
        foreColor: this.foreColor
      }
    }
  }
  freeDrawGeometry(evt: MouseEvent): any {
    var rect = this.drawingCanvas.nativeElement.getBoundingClientRect()
    var toX = evt.clientX - rect.left
    var toY = evt.clientY - rect.top
    var fromX = toX - evt.movementX
    var fromY = toY - evt.movementY
    return { fromX: fromX, fromY: fromY, toX: toX, toY: toY }
  }

  onFreeDraw$(): Observable<{ fromX: number, fromY: number, toX: number, toY: number }> {
    return this.freeDrawSubject$
  }

  onDrawEllipse$(): Observable<{ cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, backColor: string }> {
    return this.drawEllipseSubject$
  }
  onDrawRect$(): Observable<{ cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, backColor: string }> {
    return this.drawRectSubject$
  }

  onClick$(): Observable<any> {
    return this.clickLocationSubject$
  }

  listMarker: Array<MarkerImage> = [];
  addMarker(marker: MarkerImage, drawobj) {
    var obs = this.commService.addMarker(marker);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res]
      )
    );
    obs2.subscribe(
      ([responses, res]) => {
        marker.markerID = res.markerID;
        if (res.responseType == "ResponseMarkerAdd") {
          this.listMarker.push(marker);
        }
        if (this.DoUpdate(res)) {
          this.notificationSer.Notify(marker.docID, "update")
        }
        responses.next([res, drawobj])
      }
    )
  }

  DoUpdate(res) {
    if ((res.responseType == "ResponseMarkerAdd" || res.responseType == "ResponseOK" || res.responseType == "ResponseDelMarker" || res.responseType == "ResponseDelAllMarkersDoc") && this.ifShared) {
      return true;
    }
    return false;
  }


  ifShared: boolean;
  DeleteMarker(marker: MarkerImage) {
    var obs = this.commService.DeleteMarker(marker);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) => {
        if (this.DoUpdate(res)) {
          this.notificationSer.Notify(marker.docID, "update")
        }
        responses.next([res, marker.markerID]);
      }
    )

  }
  GetDocument(docid: number) {
    var obs = this.commService.GetDocument(docid);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )
  }

  GetMarkers(documentid: number) {
    console.log(documentid, "documentid")
    var obs = this.commService.GetMarkers(documentid);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) => {
        responses.next(res)
      }
    )
  }




  RemoveAllMarkersOfDoc(docid: number) {
    var obs = this.commService.RemoveAllMarkersOfDoc(docid);
    var obs2 = obs.pipe(
      map(res => [this.responses[res.responseType], res])
    );
    obs2.subscribe(
      ([responses, res]) => {
        if (this.DoUpdate(res)) {
          this.notificationSer.Notify(docid, "update")
        }
        responses.next(res)
      }
    )
  }



  onResponseDocument(): Subject<any> {
    return this.responses.ResponseDocument;
  }


  onResponseOK(): Subject<any> {
    return this.responses.ResponseOK;
  }

  onResponseMarkerAdd(): Subject<any> {

    return this.responses.ResponseMarkerAdd;
  }

  onResponseMistakeDetails(): Subject<any> {
    return this.responses.ResponseMistakeDetails
  }

  onResponseErr(): Subject<any> {

    return this.responses.ResponseErr
  }

  onResponseListMarkers(): Subject<any> {
    return this.responses.ResponseListMarkers
  }
  onResponseIfShared(): Subject<any> {
    return this.responses.ResponseIfShared
  }
  onResponseListUsers(): Subject<any> {
    return this.responses.ResponseListUsers;
  }
  OnResponseSharedUsers(): Subject<any> {
    return this.responses.ResponseSharedUsers;
  }
  OnResponseDelMarker(): Subject<any> {
    return this.responses.ResponseDelMarker;
  }
  OnResponseDelAllMarkersDoc(): Subject<any> {
    return this.responses.ResponseDelAllMarkersDoc;
  }
  OnResponseUsersAdded(): Subject<any> {
    return this.responses.ResponseUsersAdded;
  }
}

