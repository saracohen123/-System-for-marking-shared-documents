using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
   public class ResponseSharedUsers:Response
    {
        public List<User> ListSharedUsers { get; set; }
    }
}
