using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
//using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
//using Microsoft.AspNetCore.Cors;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MarkerIMG.Controllers
{
    [Route("api/[controller]/{action}")]
    [ApiController]
    public class Marker : ControllerBase
    {
        IMarkerService MarkerService;
        public Marker(IMarkerService _MarkerService)
        {
            MarkerService = _MarkerService;
        }

        [HttpPost]
        public Response CreateMarker([FromBody] MarkerContracts.DTO.Marker marker)
        {
            return MarkerService.CreateMarker(marker);
        }

        [HttpPost]
        public Response RemoveMarker([FromBody] MarkerRequest markerRequest)
        {
            return MarkerService.RemoveMarker(markerRequest);
        }
        [HttpPost]
        public Response GetMarkers([FromBody] DocumentRequest documentRequest)
        {
            return MarkerService.GetMarkers(documentRequest);
        }

        [HttpPost]
        public Response RemoveAllMarkersOfDoc([FromBody] DocumentRequest documentRequest)
        {
           return MarkerService.RemoveAllMarkersOfDoc(documentRequest);
        }

        [HttpPost]
        public Response UpdateText([FromBody] RequestText requestText)
        {
            return MarkerService.UpdateText(requestText);
        }


    }
}
