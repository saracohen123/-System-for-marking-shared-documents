using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
   public class ResponseListUsers:Response
    {
        public List<User> ListUsers  { get; set; }

    }
}
