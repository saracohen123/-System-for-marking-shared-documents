using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
    public class Document
     {
        [DBParameter("UserID")]
        public string  UserID { get; set; }
        [DBParameter("ImageURL")]
        public string ImageURL { get; set; }
        [DBParameter("DocumentName")]
        public string DocumentName { get; set; }
        [DBParameter("docID")]
        public int docID { get; set; }


    }
}
