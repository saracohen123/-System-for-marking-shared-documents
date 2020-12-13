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
    public class Sharing : ControllerBase
    {
        ISharingService SharingService;
        public Sharing(ISharingService _SharingService)
        {
            SharingService = _SharingService;
        }

        [HttpPost]
        public Response CreateShare([FromBody] SharingRequest sharingRequest)
        {
            //Add sharing to user list
            return SharingService.CreateShare(sharingRequest);
        }
       
        [HttpPost]
        public Response RemoveShare([FromBody] SharingRequest sharingRequest)
        {  //Removing common people in the document
            return SharingService.RemoveShare(sharingRequest);
        }

        [HttpPost]
        public Response GetSharedUsers([FromBody] DocumentRequest documentRequest)
        {
            return SharingService.GetSharedUsers(documentRequest);
        }

        [HttpPost]
        public Response GetSharedDocuments([FromBody] UserRequest userRequest)
        {
            return SharingService.GetSharedDocuments(userRequest);
        }

        [HttpPost]
        public Response IfDocumentIsShared([FromBody] DocumentRequest documentRequest)
        {
            return SharingService.IfDocumentIsShared(documentRequest);
        }

      
    }
}
