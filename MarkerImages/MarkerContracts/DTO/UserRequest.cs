using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
    public class UserRequest
    {
        [DBParameter("UserID")]
        public string UserID { get; set; }
    }
}
