using Contracts;
using infraDALContracts;
using System;
using System.Data.SqlClient;

namespace DALimpSQL
{
   
    public class SQLConnectionAdapter : IDBConnection
    {
        public SqlConnection Connection { get; }
        public SQLConnectionAdapter(string strConnection)
        {
            Connection = new SqlConnection(strConnection);
        }

    }
}
