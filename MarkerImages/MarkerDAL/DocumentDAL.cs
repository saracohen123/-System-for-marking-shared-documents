using Contracts;
using DalParametersConverter;
using DI_Factory;
using infraDALContracts;
using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Runtime.Intrinsics.X86;
using System.Text;

namespace MarkerImagesDAL
{
    [Register(policy.singleton, typeof(IDocumentDAL))]
    public class DocumentDAL : IDocumentDAL
    {
        IInfraDal dal;
        IDBConnection con;
        DBParameterConverter _paramConverter;
        public DocumentDAL(IInfraDal _dal)
        {
            dal = _dal;
            con = dal.Connect("Server=(localdb)\\MSSQLLocalDB;Database=Images;" +
           "Trusted_Connection=True;");
            _paramConverter = new DBParameterConverter(dal);
        }
        public DataSet CreateDocument(Document document)
        {
            var p = _paramConverter.ConvertToParameter(document, "UserID");
            var p1 = _paramConverter.ConvertToParameter(document, "ImageURL");
            var p2 = _paramConverter.ConvertToParameter(document, "DocumentName");
            var data = dal.ExecSPQuery("CreateDocument", con, p, p1, p2);
            return data;
        }
        public void RemoveDocument(DocumentRequest documentRequest)
        {
            var p = _paramConverter.ConvertToParameter(documentRequest, "docID");
            dal.ExecSPQuery("RemoveDocument", con, p);
        }

        public bool GetDocID(DocumentRequest documentRequest)
        {
            var p = _paramConverter.ConvertToParameter(documentRequest, "docID");
            var data = dal.ExecSPQuery("GetDocument", con, p);
            var t = data.Tables;
            if (data.Tables[0].Rows.Count > 0)
            {
                DataRow row = data.Tables[0].Rows[0];
                if (data.Tables[0].Rows.Count >= 1 && (bool)row[4] == true)
                {
                    return true;
                }
            }
            return false;
        }

        public DataSet GetDocuments(UserRequest userRequest)
        {
            var p = _paramConverter.ConvertToParameter(userRequest, "UserID");
            var data = dal.ExecSPQuery("getDocumentsForUser", con, p);
            return data;

        }

        public DataSet GetDocument(DocumentRequest documentRequest)
        {
            var p = _paramConverter.ConvertToParameter(documentRequest, "docID");
            var data = dal.ExecSPQuery("GetDocument", con, p);
            return data;
        }



    }
}
