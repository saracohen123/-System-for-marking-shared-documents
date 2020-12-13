using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace MarkerContracts.Interfaces
{
    public interface IMarkerDAL
    {
        DataSet CreateMarker(Marker marker);
        bool GetMarkerID(MarkerRequest markerRequest);
        void RemoveMarker(MarkerRequest markerRequest);
        DataSet GetMarkers(DocumentRequest documentRequest);
        void RemoveAllMarkersOfDoc(DocumentRequest documentRequest);
        void UpdateText(RequestText requestText);
    }
}
