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
    [Register(policy.singleton, typeof(ISharingDAL))]
    public class SharingDAL : ISharingDAL
    {
        IInfraDal dal;
        IDBConnection con;
        IDBParameter p;
        DBParameterConverter _paramConverter;
        public SharingDAL(IInfraDal _dal)
        {
            dal = _dal;
            con = dal.Connect("Server=(localdb)\\MSSQLLocalDB;Database=Images;" +
           "Trusted_Connection=True;");
            _paramConverter = new DBParameterConverter(dal);
        }
        public void CreateShare(Sharing sharing)
        {
            var parameters = _paramConverter.ConvertToParameters(sharing);
            dal.ExecSPQuery("CreateShare", con, parameters);
        }


        public bool GetUserIDShare(string s)
        {
            var data = dal.ExecSPQuery("GetSharedDocuments", con);
            foreach (DataRow row in data.Tables[0].Rows)
            {
                if ((string)row[1] == s && (bool)row[2] == true)
                {
                    return true;
                }
            }
            return false;
        }

        public DataSet GetSharedDocumentsForUser(UserRequest userRequest)
        {
            p = _paramConverter.ConvertToParameter(userRequest, "UserID");
            var data=dal.ExecSPQuery("DocsIParticipateIn", con, p);
            return data;
        }

        public bool IfShareExist(DocumentRequest documentRequest)
        {
            p = _paramConverter.ConvertToParameter(documentRequest, "docID");
            var data = dal.ExecSPQuery("getShare", con, p);
            if(data.Tables[0].Rows.Count >0) { 
            DataRow row = data.Tables[0].Rows[0];
                return true;
            }
            return false;
        }
        public void RemoveShare(Sharing sharing)
        {
            var parameters = _paramConverter.ConvertToParameters(sharing);
            dal.ExecSPQuery("RemoveShare", con, parameters);
        }

        public DataSet GetSharedUsers(DocumentRequest documentRequest)
        {
            p = _paramConverter.ConvertToParameter(documentRequest, "docID");
            var data = dal.ExecSPQuery("getShare", con, p);
            return data;
        }
    }
}
