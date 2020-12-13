using Contracts;
using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace DALimpSQL
{
    
   
    public class SQLDAL : IInfraDal
    {
        public IDBConnection Connect(string strConnection)
        {
            return new SQLConnectionAdapter(strConnection);
        }


        public DataSet ExecSPQuery(string spName, IDBConnection con, params IDBParameter[] parameters)
        {
            var conAdapter = con as SQLConnectionAdapter;
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conAdapter.Connection;
            cmd.CommandText = spName;
            cmd.CommandType = CommandType.StoredProcedure;
            foreach (var parameter in parameters)
            {
                var parameterAdapter = parameter as SqlParameterAdapter;
                cmd.Parameters.Add(parameterAdapter.Parameter);
            }

            var retval = new DataSet();
            SqlDataAdapter dataAdapter = new SqlDataAdapter();
            dataAdapter.SelectCommand = cmd;
            dataAdapter.Fill(retval);
            cmd.Connection.Close();
            return retval;
        }

        public IDBParameter GetParameter(string paramName, object paramValue)
        {
            IDBParameter retval = new SqlParameterAdapter();
            retval.ParameterName = paramName;
            retval.Value = paramValue;
            return retval;
        }


    }
}
