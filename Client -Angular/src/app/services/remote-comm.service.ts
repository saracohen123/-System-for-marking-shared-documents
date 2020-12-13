import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { MarkerImage } from '../models/MarkerImage';
import { DocumentRequest } from '../models/DocumentRequest';
import { UserRequest } from '../models/UserRequest';
import { MessageRequest } from '../models/MessageRequest'
import { User } from '../models/User';
import { MarkerRequest } from '../models/MarkerRequest';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { ShareDocument } from '../models/ShareDocument';
import { SharingRequest } from '../models/SharingRequest';
import { RequestText } from '../models/RequestText';


@Injectable({
  providedIn: 'root'
})
export class RemoteCommService {
  constructor(private http: HttpClient) {
  } 
  
  documentRequest: DocumentRequest = new DocumentRequest(0);
  userRequest: UserRequest = new UserRequest("");
  markerRequest: MarkerRequest = new MarkerRequest(0);

  StartSocket(docid: number): Observable<any> {
    var userid = sessionStorage.getItem("currentUser")
    return webSocket({ url: "wss://localhost:44359/ws?docid=" + docid + "&userid=" + userid, deserializer: msg => msg });
  }

  message: MessageRequest= new MessageRequest("", "", "");
   UpdateDocument(docId: number,msg):Observable<any> {
    //מודיע על עדכון לכל המשותפים במסמך
    this.message.docID = docId.toString();
    this.message.userID = sessionStorage.getItem("currentUser")
    this.message.Code=msg;
    return this.http.post('/api/Sender/Send', this.message);
  }

  
  UpdateText(currentmarker:MarkerImage):Observable<any> {
    var requestText:RequestText=new RequestText(currentmarker.text,currentmarker.markerID);
    return this.http.post('/api/Marker/UpdateText',requestText);
  }

 
  GetSharedUsers(docid: number):Observable<any> {
    this.documentRequest.docID=docid;
    return this.http.post('/api/Sharing/GetSharedUsers',this.documentRequest);
  }
  RemoveShareUsers(sharingUser: ShareDocument[]):Observable<any> {
  //תמחק אנשים משותפים 
  var sharingRequest=new SharingRequest(sharingUser);
  return this.http.post('/api/Sharing/RemoveShare',sharingRequest);
  }
  GetUsers():Observable<any> {
    return this.http.get('/api/User/GetUsers');
   }
   AddUsers(sharingUser:Array<ShareDocument>):Observable<any> {
    //הוספה לטבלת שיתוף
   var sharingRequest=new SharingRequest(sharingUser);
    return this.http.post('/api/Sharing/CreateShare', sharingRequest);

  }

  LogIn(user: User):Observable<any> {
    return this.http.post('/api/User/LogIn', user);
  }

  DocsIParticipateIn(user: UserRequest): Observable<any> {
    return this.http.post('/api/Sharing/GetSharedDocuments', user);
  }
  ifExistInSharing(docid: number): Observable<any> {
    this.documentRequest.docID = docid;
    return this.http.post('/api/Sharing/IfDocumentIsShared', this.documentRequest);
  }

  GetMarkers(docid: number): Observable<any> {
    this.documentRequest.docID = docid;
    return this.http.post('/api/Marker/GetMarkers', this.documentRequest);

  }

  GetDocument(docid: number): Observable<any> {
    this.documentRequest.docID = docid;
    return this.http.post('/api/Document/GetDocument', this.documentRequest);
  }

  GetAllDocumentsForUser(user: UserRequest): Observable<any> {
    return this.http.post('/api/Document/GetDocuments', user);
  }

  DeleteMarker(marker: MarkerImage): Observable<any> {
    this.markerRequest.markerID = marker.markerID;
    return this.http.post('/api/Marker/RemoveMarker', this.markerRequest);
  }

  RemoveAllMarkersOfDoc(docId: number): Observable<any> {
    this.documentRequest.docID = docId;
    return this.http.post('/api/Marker/RemoveAllMarkersOfDoc', this.documentRequest)
  }

  addMarker(Marker: MarkerImage): Observable<any> {
    return this.http.post('/api/Marker/CreateMarker', Marker)
  }

  Register(user: User): Observable<any> {
    return this.http.post('/api/User/CreateUser', user)
  }

  creaedocument(document: Document): Observable<any> {
    return this.http.post('/api/Document/CreateDocument', document)
  }


  UploadImg(fileToUpload: any,value):Observable<any> {
    return  this.http.post('/api/Upload/Uploadf',fileToUpload);
   }


}
