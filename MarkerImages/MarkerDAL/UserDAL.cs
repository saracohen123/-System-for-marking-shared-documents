using DI_Factory;
using infraDALContracts;
using MarkerContracts.DTO;
using System;
using System.Data;
using System.Net.Http.Headers;
using System.Reflection.Metadata.Ecma335;
using System.Data.SqlClient;
using System.Linq.Expressions;
using MarkerContracts.Interfaces;
using DalParametersConverter;
using Contracts;

namespace MarkerImagesDAL
{
    [Register(policy.singleton, typeof(IUserDal))]
    public class UserDAL : IUserDal
    {
        IInfraDal dal;
        IDBConnection con;
        DBParameterConverter _paramConverter;

        public UserDAL(IInfraDal _dal)
        {
            dal = _dal;
            con = dal.Connect("Server=(localdb)\\MSSQLLocalDB;Database=Images;" +"Trusted_Connection=True;");
           
            _paramConverter = new DBParameterConverter(dal);
        }

        public void CreateUser(User user)
        {
            var parameters = _paramConverter.ConvertToParameters(user);
            dal.ExecSPQuery("CreateUser", con, parameters);
        }


        public void RemoveUser(User user)
        {
            var p = _paramConverter.ConvertToParameter(user, "UserID");
            dal.ExecSPQuery("RemoveUser", con, p);
        }

        public ModeUser IfUserExists(User user)
        {
            var parameters = _paramConverter.ConvertToParameters(user);
            var data = dal.ExecSPQuery("login", con, parameters);
            if (data.Tables[0].Rows.Count > 0)
            {
                DataRow row = data.Tables[0].Rows[0];
                if ((bool)row[2] == true)
                {
                    return ModeUser.Exist;
                }
                    return ModeUser.ExistInactiveStatus;
            }
            return ModeUser.NotExist;
        }

        public ModeUser GetUserID(UserRequest userRequest)
        {
            var p = _paramConverter.ConvertToParameter(userRequest, "UserID");
            var data = dal.ExecSPQuery("GetUserID", con, p);
            if (data.Tables[0].Rows.Count >= 1)
            {
                DataRow row = data.Tables[0].Rows[0];
                if ((bool)row[2] == true)
                {
                    return ModeUser.Exist;
                }
                return ModeUser.ExistInactiveStatus;
            }
            return ModeUser.NotExist;

        }

        public void changeTrueStatus(UserRequest userRequest)
        { 
            var p = _paramConverter.ConvertToParameter(userRequest, "UserID");
            var data = dal.ExecSPQuery("changeTrueStatus", con, p);
        }

        public DataSet GetUsers()
        {
            var data = dal.ExecSPQuery("GetUsers", con);
            return data;

        }
    }
}
