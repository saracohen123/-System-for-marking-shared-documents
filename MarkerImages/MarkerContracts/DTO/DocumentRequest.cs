using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
   public  class DocumentRequest
    {
        [DBParameter("docID")]
        public int DocID { get; set; }

    }
}
