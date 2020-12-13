using Contracts;
using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace DALimpSQL
{
 
    public class SqlParameterAdapter : IDBParameter
    {
        public SqlParameter Parameter { get; }
        public SqlParameterAdapter()
        {
            Parameter = new SqlParameter();
        }
        public string ParameterName { get => Parameter.ParameterName; set => Parameter.ParameterName = value; }
        public object Value { get => Parameter.Value; set => Parameter.Value = value; }
    }
}
