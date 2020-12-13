using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.Interfaces
{
   public interface IMarkerService
    {
        Response CreateMarker(Marker marker);
        Response RemoveMarker(MarkerRequest markerRequest);
        Response GetMarkers(DocumentRequest documentRequest);
        Response RemoveAllMarkersOfDoc(DocumentRequest documentRequest);
        Response UpdateText(RequestText requestText);
    }
}
