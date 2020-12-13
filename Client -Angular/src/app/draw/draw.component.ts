import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent } from 'rxjs';
import { DrawingService } from '../services/drawing.service';
import { MarkerImage } from '../models/MarkerImage';
import { ActivatedRoute } from '@angular/router';
import { Document } from '../models/Document';
import { ShareDocument } from '../models/ShareDocument';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { AllDocumentService } from '../services/all-document.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css'],
  providers: [DrawingService]
})
export class DrawComponent implements OnInit {
  constructor(public notificationSer: NotificationService, public drawservice: DrawingService, public activate: ActivatedRoute, private sanitizer: DomSanitizer, public allDocuments: AllDocumentService) { }
  @ViewChild("container")
  container: ElementRef;
  @ViewChild("shapeCanvas")
  shapeCanvas: ElementRef;
  @ViewChild("drawingCanvas")
  drawingCanvas: ElementRef;
  @ViewChild("div1")
  div1: ElementRef;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  docid: number = 0;
  userid: string;
  document: Document = new Document("", "", "", 0)
  public backgroundImg: SafeStyle;
  showUsers = false;
  canShare = false;
  ifShowText: boolean = false;
  items = [];
  selected = [];
  ListAllUsers = [];
  ListSharedUsers = [];
  didIconnectsocket = false;

  ngOnInit(): void {


    this.drawservice.onResponseListUsers().subscribe(
      data => {
        for (let i = 0; i < data.listUsers.length; i++) {
          if (sessionStorage.getItem("currentUser") != data.listUsers[i].userID) {
            this.ListAllUsers.push(data.listUsers[i].userID)
          }
        }
      }
    )

    this.drawservice.OnResponseUsersAdded().subscribe(
      data => {
        if (this.didIconnectsocket == false) {
          this.drawservice.StartSocket(this.docid)
          this.drawservice.ifShared = true;
          this.didIconnectsocket = true;
        }
      }
    )

    this.drawservice.OnResponseSharedUsers().subscribe(
      data => {
        for (let i = 0; i < data.listSharedUsers.length; i++) {
          if (sessionStorage.getItem("currentUser") != data.listSharedUsers[i].userID) {
            this.ListSharedUsers.push(data.listSharedUsers[i].userID)
          }
        }
      }
    )


    this.drawservice.onResponseIfShared().subscribe(
      data => {
        if (data.ifShared) {
          this.drawservice.ifShared = true;
          this.drawservice.StartSocket(this.docid)
          this.didIconnectsocket = true;
          this.drawservice.GetSharedUsers(this.docid);
        }
        else {
          this.drawservice.ifShared = false;
        }
      }
    )


    this.activate.params.subscribe(param => {
      this.docid = +param["docid"];
      this.drawservice.ifExistInSharing(this.docid)
    });

    this.drawservice.onResponseOK().subscribe(
      succ => console.log("succ")
    )

    this.drawservice.onResponseErr().subscribe(
      data => {
        console.log("Err response")
      }
    )

    this.drawservice.onResponseMistakeDetails().subscribe(
      data => console.log("MistakeDetails")
    )

    this.drawservice.OnResponseDelMarker().subscribe(
      data => {
        var flag = 1;
        //data[1]-markerid
        //data[0]=ResponseDelMarker
        var canvas = this.shapeCanvas.nativeElement;
        this.clearCanvas(canvas)
        for (let i = 0; i < this.drawservice.listMarker.length && flag; i++) {
          if (this.drawservice.listMarker[i].markerID == data[1]) {
            this.drawservice.listMarker.splice(i, 1)
            flag = 0;
          }
        }
        this.PrintMarkers();
      }
    )

    this.drawservice.OnResponseDelAllMarkersDoc().subscribe(
      data => {
        var canvas = this.shapeCanvas.nativeElement
        this.clearCanvas(canvas)
        this.drawservice.listMarker = [];
      }
    )

    this.drawservice.onResponseMarkerAdd().subscribe(
      data => {
        if (data[1][1] == "ellipse") {
          this.drawEllipse(this.shapeCanvas.nativeElement, data[1][0])
        }
        else if (data[1][1] == "rectengle") {
          this.drawRect(this.shapeCanvas.nativeElement, data[1][0])
        }
      }
    )


    this.drawservice.GetUsers();
  }

  ngAfterViewInit() {
    console.log(document.querySelector("#container"))
    console.log(document.querySelector("#container").getBoundingClientRect())
    this.shapeCanvas.nativeElement.left = document.querySelector("#container").clientLeft
    this.shapeCanvas.nativeElement.top = document.querySelector("#container").clientTop
    this.shapeCanvas.nativeElement.width = document.querySelector("#container").clientWidth
    this.shapeCanvas.nativeElement.height = document.querySelector("#container").clientHeight
    this.drawingCanvas.nativeElement.left = document.querySelector("#container").clientLeft
    this.drawingCanvas.nativeElement.top = document.querySelector("#container").clientTop
    this.drawingCanvas.nativeElement.width = document.querySelector("#container").clientWidth
    this.drawingCanvas.nativeElement.height = document.querySelector("#container").clientHeight

    this.drawservice.Init(this.drawingCanvas, this.shapeCanvas)
    this.drawservice.onFreeDraw$().subscribe(
      freeDrawObject => {
        this.FreeDraw(this.drawingCanvas.nativeElement, freeDrawObject)
      }
    )

    this.drawservice.onClick$().subscribe(
      clickLocation => {
        if (this.drawservice.drawingMode == "text") {
          this.AddComment(clickLocation);
        }
        if (this.drawservice.drawingMode == "del") {
          this.deleteMarker(clickLocation);
        }
      }
    )

    this.drawservice.onDrawRect$().subscribe
      ((drawingObject: { cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, backColor: string }) => {
        var drawObj = [drawingObject, "rectengle"];
        this.drawservice.addMarker(new MarkerImage(this.docid, this.drawservice.drawingMode, drawingObject.cx, drawingObject.cy, drawingObject.radiusx, drawingObject.radiusy, drawingObject.foreColor, sessionStorage.getItem("currentUser"), ""), drawObj);
      })

    this.drawservice.onDrawEllipse$().subscribe
      ((drawingObject: { cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, backColor: string }) => {
        var drawObj = [drawingObject, "ellipse"];
        this.drawservice.addMarker(new MarkerImage(this.docid, this.drawservice.drawingMode, drawingObject.cx, drawingObject.cy, drawingObject.radiusx, drawingObject.radiusy, drawingObject.foreColor, sessionStorage.getItem("currentUser"), ""), drawObj);
      })

    var forecolor$ = fromEvent(document.querySelector("#foreColor"), 'input')
    console.log("forecolor$ ")

    forecolor$.subscribe(evt => {
      this.SetForeColor((evt.target as HTMLInputElement).value)
    })

    this.drawservice.onResponseDocument().subscribe(
      data => {
        this.document.docID = data.document.docID;
        this.document.documentName = data.document.documentName;
        this.document.imageURL = data.document.imageURL;
        this.document.userID = data.document.userID;
        this.document.imageURL = this.document.imageURL.replace(" ", "%20");
        this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(' + this.document.imageURL + ')');
        if ((String)(sessionStorage.getItem("statusDocument") == "old document")) {
          this.drawservice.GetMarkers(this.docid);
        }
        if (this.document.userID == sessionStorage.getItem("currentUser")) {
          this.canShare = true;
        }
      }
    )

    this.drawservice.onResponseListMarkers().subscribe(
      data => {
        if ((String)(sessionStorage.getItem("statusDocument")) != "new document") {
          var canvas = this.shapeCanvas.nativeElement;
          this.clearCanvas(canvas);
        }
        if (data.lst != null) {
          this.drawservice.listMarker = data.lst;
          this.PrintMarkers();
        }
        else {
          this.drawservice.listMarker = [];
        }
        sessionStorage.setItem("statusDocument", "old document")
      }
    )
    //Getting the current document details
    this.drawservice.GetDocument(this.docid);
  }


  drawEllipse(canvas, drawingObject: { cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, text?: string }) {
    this.clearCanvas(this.drawingCanvas.nativeElement)
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = drawingObject.foreColor
    ctx.beginPath()
    ctx.ellipse(drawingObject.cx,
      drawingObject.cy,
      drawingObject.radiusx,
      drawingObject.radiusy,
      0, 0, Math.PI * 2)
    ctx.stroke()
    sessionStorage.setItem("statusDocument", "old document")
  }


  drawRect(canvas, drawingObject: { cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, backColor: string, text?: string }) {
    this.clearCanvas(this.drawingCanvas.nativeElement)
    var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.strokeStyle = drawingObject.foreColor
    ctx.fillStyle = drawingObject.backColor
    ctx.beginPath()
    ctx.rect(drawingObject.cx - drawingObject.radiusx,
      drawingObject.cy - drawingObject.radiusy,
      drawingObject.radiusx * 2,
      drawingObject.radiusy * 2
    )
    ctx.stroke()
    sessionStorage.setItem("statusDocument", "old document")
  }

  FreeDraw(canvas: any, freeDrawObject: { fromX: number; fromY: number; toX: number; toY: number; }): void {
    var ctx = canvas.getContext('2d');
    console.log(ctx.fillStyle)
    ctx.lineWidth = 4;
    ctx.beginPath()
    ctx.moveTo(freeDrawObject.fromX, freeDrawObject.fromY)
    ctx.lineTo(freeDrawObject.toX, freeDrawObject.toY)
    ctx.stroke()
  }

  currentmarker: MarkerImage = new MarkerImage(null, null, null, null, null, null, null, null, null, null);
  i: number;
  //Add text to a specific markup
  AddComment({ varx: varx, vary: vary }) {
    var div = this.div1.nativeElement;
    div.style.visibility = "hidden";
    this.ifShowText = false;
    var canvas = this.shapeCanvas.nativeElement;
    var ctx = canvas.getContext('2d');
    var flag = true;
    for (this.i = 0; this.i < this.drawservice.listMarker.length && flag; this.i++) {
      var marker = this.drawservice.listMarker[this.i];
      this.currentmarker = new MarkerImage(marker.docID, marker.markerType, marker.cx, marker.cy, marker.rx, marker.ry, marker.fore, marker.userID, marker.text, marker.markerID);
      if (this.currentmarker.markerType == "ellipse") {
        var c = new Path2D();
        c.ellipse(this.currentmarker.cx, this.currentmarker.cy, this.currentmarker.rx, this.currentmarker.ry, 0, 0, Math.PI * 2);
        if (ctx.isPointInPath(c, varx, vary, 'evenodd')) {
          flag = false;
          this.ifShowText = true;
          div.style.visibility = "visible";
          div.style.borderRadius = "50%";
          div.style.width = (this.currentmarker.rx * 2) + "px";
          div.style.height = (this.currentmarker.ry * 2) + "px";
          div.style.top = (this.currentmarker.cy - this.currentmarker.ry) + "px";
          div.style.left = (this.currentmarker.cx - this.currentmarker.rx) + "px";
        }
      }
      else if (this.currentmarker.markerType == "rectengle") {
        var c = new Path2D();
        c.rect(this.currentmarker.cx - this.currentmarker.rx, this.currentmarker.cy - this.currentmarker.ry, this.currentmarker.rx * 2, this.currentmarker.ry * 2);
        if (ctx.isPointInPath(c, varx, vary, 'evenodd')) {
          flag = false;
          this.ifShowText = true;
          div.style.visibility = "visible";
          div.style.borderRadius = "0%";
          div.style.width = (this.currentmarker.rx * 2) + "px";
          div.style.height = (this.currentmarker.ry * 2) + "px";
          div.style.top = (this.currentmarker.cy - this.currentmarker.ry) + "px";
          div.style.left = (this.currentmarker.cx - this.currentmarker.rx) + "px";
        }
      }
    }
    this.i--;
  }

  SaveComment() {
    this.drawservice.UpdateText(this.currentmarker);
    this.drawservice.listMarker[this.i].text = this.currentmarker.text;
  }

  deleteMarker({ varx: varx, vary: vary }) {
    var canvas = this.shapeCanvas.nativeElement;
    var ctx = canvas.getContext('2d');
    var flag = 1;
    for (let i = this.drawservice.listMarker.length - 1; i >= 0 && flag; --i) {
      var marker = this.drawservice.listMarker[i];
      if (marker.markerType == "ellipse") {
        var c = new Path2D();
        c.ellipse(marker.cx, marker.cy, marker.rx, marker.ry, 0, 0, Math.PI * 2);
        if (ctx.isPointInPath(c, varx, vary, 'evenodd')) {
          this.drawservice.DeleteMarker(marker);
          flag = 0;
        }
      }
      else if (marker.markerType == "rectengle") {
        var c = new Path2D();
        c.rect(marker.cx - marker.rx, marker.cy - marker.ry, marker.rx * 2, marker.ry * 2);
        if (ctx.isPointInPath(c, varx, vary, 'evenodd')) {
          this.drawservice.DeleteMarker(marker);
          flag = 0;
        }
      }
    }
  }

  HidesSharingOptions() {
    this.showUsers = false;
    this.addFlag = false;
    this.removeFlag = false;
  }
//Print the markings on the canvas
  PrintMarkers() {
    var canvas = this.shapeCanvas.nativeElement;
    this.drawservice.listMarker.forEach(element => {
      if (element.markerType == "rectengle") {
        this.drawRect(canvas, { cx: element.cx, cy: element.cy, radiusx: element.rx, radiusy: element.ry, backColor: "", foreColor: element.fore, text: element.text })
      }
      else if (element.markerType == "ellipse") {
        this.drawEllipse(canvas, { cx: element.cx, cy: element.cy, radiusx: element.rx, radiusy: element.ry, foreColor: element.fore, text: element.text })
      }
    });
  }

  ToShowUsers() {
    this.selected = [];
    this.addFlag = true;
    this.removeFlag = false;
    this.items = this.ListAllUsers;
    this.showUsers = true;
  }

  shareringUser: Array<ShareDocument> = [];
  //Sharing more people in the document
  AddUsers() {
    this.selected.forEach(element => {
      this.shareringUser.push(new ShareDocument(element, this.docid));
      this.ListSharedUsers.push(element)
    });
    //Remove duplicates
    this.ListSharedUsers = this.ListSharedUsers.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    this.shareringUser.push(new ShareDocument(sessionStorage.getItem("currentUser"), this.docid));
    this.drawservice.AddUsers(this.shareringUser)
    this.selected = [];
    this.shareringUser = [];
  }

  removeFlag: boolean = false;
  addFlag: boolean = false;
  ShowSharedUsers() {
    this.selected = [];
    this.addFlag = false;
    this.removeFlag = true;
    this.items = this.ListSharedUsers;
    this.showUsers = true;
  }
//Remove sharing people in a document
  RemoveShareUsers() {
    this.selected.forEach(element => {
      this.shareringUser.push(new ShareDocument(element, this.docid));
      this.ListSharedUsers = this.ListSharedUsers.filter(e => e !== element);
    });
    this.items = this.ListSharedUsers;
    this.drawservice.RemoveShareUsers(this.shareringUser);
    this.selected = [];
    this.shareringUser = [];
  }

  SetMode(mode: string) {
    this.drawservice.setDrawMode(mode)
    var div = this.div1.nativeElement;
    div.style.visibility = "hidden";
    if (mode != "text") {
      this.ifShowText = false;
    }
  }

  SetForeColor(color: string) {
    this.drawservice.setForeColor(color)
  }

  clearCanvas(canvas) {
    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  Clear() {
    var div = this.div1.nativeElement;
    div.style.visibility = "hidden";
    this.drawservice.RemoveAllMarkersOfDoc(this.docid);
    this.ifShowText = false;
  }

}
