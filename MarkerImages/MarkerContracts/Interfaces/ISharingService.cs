using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.Interfaces
{
    public interface ISharingService
    {
         Response CreateShare(SharingRequest sharingRequest);
         Response GetSharedDocuments(UserRequest userRequest);
        Response RemoveShare(SharingRequest sharingRequest);
        Response IfDocumentIsShared(DocumentRequest documentRequest);
        Response GetSharedUsers(DocumentRequest documentRequest);
    }
}
