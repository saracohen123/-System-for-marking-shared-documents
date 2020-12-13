using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace MarkerContracts.Interfaces
{
   public interface ISharingDAL
    {
         void CreateShare(Sharing sharing);
        //אולי למחוק
         bool GetUserIDShare(string str);
         DataSet GetSharedDocumentsForUser(UserRequest userRequest);
         bool IfShareExist(DocumentRequest documentRequest);
        void RemoveShare(Sharing sharing);
        DataSet GetSharedUsers(DocumentRequest documentRequest);
    }
}
