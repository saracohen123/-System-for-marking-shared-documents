using Contracts;
using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace MarkerImagesServiceImp
{
    [Register(policy.singleton, typeof(ISharingService))]
    public class SharingService : ISharingService
    {
        IUserDal _dalUser;
        IDocumentDAL _daldoc;
        ISharingDAL _dalshare;
        public SharingService(IUserDal dalUser, IDocumentDAL daldoc, ISharingDAL dalshare)
        {
            _dalUser = dalUser;
            _daldoc = daldoc;
            _dalshare = dalshare;
        }

        public Response CreateShare(SharingRequest sharingRequest)
        {
            try
            {
                foreach (var share in sharingRequest.ListShare)
                {
                    _dalshare.CreateShare(share);
                }
                return new ResponseUsersAdded();
            }
            catch
            {
                return new ResponseErr();
            }
        }

        public Response GetSharedDocuments(UserRequest userRequest)
        {
            List<Document> listdoc = new List<Document>();
            try
            {
                var data = _dalshare.GetSharedDocumentsForUser(userRequest);

                foreach (DataRow row in data.Tables[0].Rows)
                {
                    Document r = new Document() { UserID = (string)row[0], DocumentName = (string)row[2], docID = (int)row[3], ImageURL = (string)row[1] };
                    listdoc.Add(r);
                }
                return new ResponseListDocument() { lst = listdoc };
            }
            catch
            {
                return new ResponseErr();
            }
        }

        public Response GetSharedUsers(DocumentRequest documentRequest)
        {
            try
            {
                var data = _dalshare.GetSharedUsers(documentRequest);
                ResponseSharedUsers responseSharedUsers = new ResponseSharedUsers();
                responseSharedUsers.ListSharedUsers = new List<User>();
                foreach (DataRow row in data.Tables[0].Rows)
                {
                    responseSharedUsers.ListSharedUsers.Add(new User() { UserID = (string)row[1] });
                }
                return responseSharedUsers;
            }
            catch
            {
                return new ResponseErr();
            }


        }

        public Response IfDocumentIsShared(DocumentRequest documentRequest)
        {
            try
            {
                if (_dalshare.IfShareExist(documentRequest))
                {
                    return new ResponseIfShared() { IfShared = true };
                }
                return new ResponseIfShared() { IfShared = false };
            }
            catch
            {
                return new ResponseErr();
            }
        }

        public Response RemoveShare(SharingRequest sharingRequest)
        {
            try
            {
                foreach (var share in sharingRequest.ListShare)
                {
                    _dalshare.RemoveShare(share);
                }
                return new ResponseOK();
            }
            catch
            {
                return new ResponseErr();
            }

        }

    }
}
