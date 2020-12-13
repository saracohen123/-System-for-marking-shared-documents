using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
  public class Sharing
    {
        [DBParameter("docID")]
        public int docID { get; set; }
        [DBParameter("userID")]
        public string userID { get; set; }
    }
}
