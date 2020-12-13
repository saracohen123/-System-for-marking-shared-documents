import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRequest } from '../models/UserRequest';
import { AllDocumentService } from '../services/all-document.service';

@Component({
  selector: 'app-main-document',
  templateUrl: './main-document.component.html',
  styleUrls: ['./main-document.component.css']
})
export class MainDocumentComponent implements OnInit {

  constructor(public router: Router, public alldocservice: AllDocumentService) { }

  ngOnInit(): void {
    this.alldocservice.onResponseListDocument().subscribe(
      data => {
        this.listDocuments = data.lst;
      }
    )

    this.alldocservice.onResponseErr().subscribe(
      data => console.log("ResponseErr all documents")
    )
  }

  listDocuments: Array<Document> = [];
  user:UserRequest = new UserRequest(sessionStorage.getItem("currentUser"));

  CreateDocument() {
    this.router.navigate(['createdocument']);
  }

  DocsIParticipateIn() {
    this.alldocservice.DocsIParticipateIn(this.user);
  }

  GetMyDocuments() {
    this.alldocservice.GetAllDocumentsForUser(this.user);
  }

  ToViewDoc(document: any) {
    sessionStorage.setItem("statusDocument", "old document");
    this.router.navigate(['draw', document.docID]);
  }

}
