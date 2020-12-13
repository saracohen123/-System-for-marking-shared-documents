import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from '../models/Document';
import { RemoteCommService } from '../services/remote-comm.service';
import { CreatedocumentService } from '../services/createdocument.service';
import { AllDocumentService } from '../services/all-document.service';
@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent implements OnInit {
  public progress: number;
  public message: string;
  constructor(private http: HttpClient, public commService: RemoteCommService, public createdocser: CreatedocumentService, public router: Router, public alldocs: AllDocumentService) { }
  document: Document = new Document("", "", "", 0);

  ngOnInit(): void {
    this.createdocser.onResponseUploaded().subscribe(
      data => {
        //When successfully uploading navigates to the draw page
        this.router.navigate(['draw', this.document.docID]);
      }
    )
    
    this.createdocser.onResponseMistakeDetails().subscribe(
      data => console.log("MistakeDetails")
    )

    this.createdocser.onResponseErr().subscribe(
      data => console.log("ResponseErr")
    )

    this.createdocser.onResponseDocumentId().subscribe(
      data => {
        this.document.docID = data.documentId;
        //Upload the image
        this.createdocser.UploadImg(this.formData, { reportProgress: true, observe: 'events' })
      }
    )
  }

  formData: FormData = new FormData();
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let file = files[0];
    let fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.document.imageURL = "assets/" + (String)(file.name);
    this.document.userID = sessionStorage.getItem("currentUser");
    (<HTMLInputElement> document.getElementById("buttonSubmit")).disabled = false;
  }

  submit() {
    sessionStorage.setItem("statusDocument", "new document");
    // Add the document to the database
    this.createdocser.createdocument(this.document);
  }
}




