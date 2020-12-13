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
    public class Sender : ControllerBase
    {
        IMessanger _messanger;
        public Sender(IMessanger messanger)
        {
            _messanger = messanger;

        }

        // POST api/<Sender>
        [HttpPost]
        public async Task Send(MessageRequest messageRequest)
        {
            await _messanger.Send(messageRequest.userID, messageRequest.docID, messageRequest.Code);
        }

      
    }
}
