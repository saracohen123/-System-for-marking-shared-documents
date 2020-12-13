using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
    public class Response
    {
        public string ResponseType { get; }
        public Response()
        {
            ResponseType = GetType().Name;
        }
    }
}
