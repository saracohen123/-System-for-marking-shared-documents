using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace MarkerContracts.Interfaces
{
   public interface IDocumentDAL
    {
        DataSet CreateDocument(Document document);
        void RemoveDocument(DocumentRequest documentRequest);
        DataSet GetDocuments(UserRequest userRequest);
        bool GetDocID(DocumentRequest documentRequest);
        DataSet GetDocument(DocumentRequest documentRequest);
    }
}
