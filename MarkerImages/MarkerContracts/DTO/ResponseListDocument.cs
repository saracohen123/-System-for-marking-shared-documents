using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
   public class ResponseListDocument:ResponseOK
    {
        
        public List<Document> lst { get; set; }
    }
}
