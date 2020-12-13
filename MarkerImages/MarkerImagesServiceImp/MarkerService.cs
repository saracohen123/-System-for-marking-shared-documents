using Contracts;
using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace MarkerImagesServiceImp
{
    [Register(policy.singleton, typeof(IMarkerService))]
    public class MarkerService : IMarkerService
    {
        IMarkerDAL _dalMarker;
        IDocumentDAL _dalDoc;

        public MarkerService(IMarkerDAL dalMarker, IDocumentDAL dalDoc)
        {
            _dalMarker = dalMarker;
            _dalDoc = dalDoc;
        }

        public Response CreateMarker(Marker marker)
        {
            try
            {
                var data = _dalMarker.CreateMarker(marker);
                DataRow row = data.Tables[0].Rows[0];
                var identity = row[0];
                int id = (int)identity;
                return new ResponseMarkerAdd() { MarkerID = id };
            }
            catch
            {
                return new ResponseErr();
            }
        }


        public Response RemoveAllMarkersOfDoc(DocumentRequest documentRequest)
        {
            try
            {
                _dalMarker.RemoveAllMarkersOfDoc(documentRequest);
                return new ResponseDelAllMarkersDoc();
            }
            catch
            {
                return new ResponseErr();
            }

        }

        public Response RemoveMarker(MarkerRequest markerRequest)
        {
            try
            {
                _dalMarker.RemoveMarker(markerRequest);
                return new ResponseDelMarker();
            }
            catch
            {
                return new ResponseErr();
            }
        }


        public Response GetMarkers(DocumentRequest documentRequest)
        {
            try
            {
                var data = _dalMarker.GetMarkers(documentRequest);
                ResponseListMarkers responseListMarkers = new ResponseListMarkers();
                if (data.Tables[0].Rows.Count >= 1)
                {
                    responseListMarkers.lst = new List<Marker>();
                    foreach (DataRow row in data.Tables[0].Rows)
                    {
                        responseListMarkers.lst.Add(new Marker()
                        {
                            cx = (double)row[3],
                            cy = (double)row[4],
                            docID = (int)row[0],
                            MarkerID = (int)row[1],
                            rx = (double)row[5],
                            ry = (double)row[6],
                            Fore = (string)row[7],
                            MarkerType = (string)row[2],
                            text = (string)row[10],
                            userID = (string)row[8]
                        });
                    }
                    return responseListMarkers;
                }
                return responseListMarkers;
            }
            catch
            {
                return new ResponseErr();
            }
        }

        public Response UpdateText(RequestText requestText)
        {
            try
            {
                _dalMarker.UpdateText(requestText);
                return new ResponseOK();
            }
            catch
            {
                return new ResponseErr();
            }
        }
    }
}
