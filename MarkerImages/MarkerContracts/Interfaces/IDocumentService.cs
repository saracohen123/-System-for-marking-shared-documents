using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.Interfaces
{
   public interface IDocumentService
    {
        Response GetDocuments(UserRequest userRequest);
        Response CreateDocument(Document document);
        Response RemoveDocument(DocumentRequest documentRequest);
        Response GetDocument(DocumentRequest documentRequest);
    }
}
