using Contracts;
using DalParametersConverter;
using DI_Factory;
using infraDALContracts;
using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace MarkerImagesDAL
{
    [Register(policy.singleton, typeof(IMarkerDAL))]
    public class MarkerDAL : IMarkerDAL
    {
        IInfraDal dal;
        IDBConnection con;
        DBParameterConverter _paramConverter;
        public MarkerDAL(IInfraDal _dal)
        {
            dal = _dal;
            con = dal.Connect("Server=(localdb)\\MSSQLLocalDB;Database=Images;" +
           "Trusted_Connection=True;");
            _paramConverter = new DBParameterConverter(dal);
        }

        public DataSet CreateMarker(Marker marker)
        {
            var p = _paramConverter.ConvertToParameter(marker, "docID");
            var p1 = _paramConverter.ConvertToParameter(marker, "MarkerType");
            var p2 = _paramConverter.ConvertToParameter(marker, "cx");
            var p3 = _paramConverter.ConvertToParameter(marker, "cy");
            var p4 = _paramConverter.ConvertToParameter(marker, "rx");
            var p5 = _paramConverter.ConvertToParameter(marker, "ry");
            var p6 = _paramConverter.ConvertToParameter(marker, "Fore");
            var p7 = _paramConverter.ConvertToParameter(marker, "userID");
            var p8 = _paramConverter.ConvertToParameter(marker, "text");
            var data = dal.ExecSPQuery("CreateMarker", con, p, p1, p2, p3, p4, p5, p6, p7, p8);
            return data;
        }

        public bool GetMarkerID(MarkerRequest markerRequest)
        {
            var p = _paramConverter.ConvertToParameter(markerRequest, "MarkerID");
            var data = dal.ExecSPQuery("getMarkerByIDMarker", con, p);
            if (data.Tables[0].Rows.Count >= 1)
            {
                return true;
            }
            return false;
        }

        public void RemoveMarker(MarkerRequest markerRequest)
        {
            var p = _paramConverter.ConvertToParameter(markerRequest, "MarkerID");
            dal.ExecSPQuery("RemoveMarker", con, p);
        }

        public DataSet GetMarkers(DocumentRequest documentRequest)
        {
            var p = _paramConverter.ConvertToParameter(documentRequest, "docID");
            var data = dal.ExecSPQuery("GetMarkers", con, p);
            return data;

        }
        public void RemoveAllMarkersOfDoc(DocumentRequest documentRequest)
        {
            var p = _paramConverter.ConvertToParameter(documentRequest, "docID");
            dal.ExecSPQuery("delMarkersOfDocument", con, p);
        }

        public void UpdateText(RequestText requestText)
        {
            var parameters = _paramConverter.ConvertToParameters(requestText);
            dal.ExecSPQuery("updatetxt", con, parameters);
        }
    }
}
