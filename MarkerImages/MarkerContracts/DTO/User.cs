using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
    public class User
    {
        [DBParameter("UserID")]
        public string UserID { get; set; }
        [DBParameter("UserName")]
        public string UserName { get; set; }

    }
}
