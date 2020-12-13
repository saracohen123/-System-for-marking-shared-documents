using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MarkerIMG.Controllers
{
    [Route("api/[controller]/{action}")]
    [ApiController]
    public class Document : ControllerBase
    {
        IDocumentService _DocumentService;
        public Document(IDocumentService DocumentService)
        {
            _DocumentService = DocumentService;
        }

        [HttpPost]
        public Response CreateDocument([FromBody] MarkerContracts.DTO.Document document)
        {
            return _DocumentService.CreateDocument(document);
        }
       
        [HttpPost]
        public Response RemoveDocument([FromBody] DocumentRequest documentRequest)
        {
            return _DocumentService.RemoveDocument(documentRequest);
        }
       
        [HttpPost]
        public Response GetDocuments([FromBody] UserRequest userRequest)
        {
            return _DocumentService.GetDocuments(userRequest);
        }
        [HttpPost]
        public Response GetDocument([FromBody] DocumentRequest documentRequest)
        {
            return _DocumentService.GetDocument(documentRequest);
        }

      
    }
}
