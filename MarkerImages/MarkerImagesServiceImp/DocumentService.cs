using Contracts;
using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Linq;

namespace MarkerImagesServiceImp
{
    [Register(policy.singleton, typeof(IDocumentService))]
    public class DocumentService : IDocumentService
    {
        IUserDal _dalUser;
        IDocumentDAL _dalDoc;
        public DocumentService(IUserDal dalUser, IDocumentDAL dalDoc)
        {
            _dalUser = dalUser;
            _dalDoc = dalDoc;
        }
        public Response CreateDocument(Document document)
        {
            UserRequest userRequest = new UserRequest();
            userRequest.UserID = document.UserID;
            try
            {
                if (_dalUser.GetUserID(userRequest) == ModeUser.Exist)
                {
                    var data = _dalDoc.CreateDocument(document);
                    DataRow row = data.Tables[0].Rows[0];
                    var identity = row[0];
                    int id = (int)identity;
                    return new ResponseDocumentId() { DocumentId = id };
                }
                return new ResponseMistakeDetails();
            }
            catch
            {
                return new ResponseErr();
            }
        }

        public Response RemoveDocument(DocumentRequest documentRequest)
        {
            try
            {
                if (_dalDoc.GetDocID(documentRequest))
                {
                    _dalDoc.RemoveDocument(documentRequest);
                    return new ResponseOK();
                }
                return new ResponseMistakeDetails();
            }
            catch
            {
                return new ResponseErr();
            }
        }


        public Response GetDocument(DocumentRequest documentRequest)
        {
            try
            {
                var data = _dalDoc.GetDocument(documentRequest);
                DataRow row = data.Tables[0].Rows[0];
                ResponseDocument r = new ResponseDocument() { Document = new Document() { UserID = (string)row[0], DocumentName = (string)row[2], docID = (int)row[3], ImageURL = (string)row[1] } };
                return r;

            }
            catch
            {
                return new ResponseErr();
            }
        }



        public Response GetDocuments(UserRequest userRequest)
        {

            try
            {

                if (_dalUser.GetUserID(userRequest) == ModeUser.Exist)
                {
                    var data = _dalDoc.GetDocuments(userRequest);
                    ResponseListDocument r = new ResponseListDocument();
                    r.lst = new List<Document>();
                    foreach (DataRow row in data.Tables[0].Rows)
                    {
                        r.lst.Add(new Document() { docID = (int)row[3], DocumentName = (string)row[2], ImageURL = (string)row[1], UserID = (string)row[0] });

                    }
                    return r;
                }
                return new ResponseMistakeDetails();

            }
            catch
            {
                return new ResponseErr();
            }
        }

    }
}
