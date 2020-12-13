using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
    public class RequestText
    {
        [DBParameter("text")]
        public string text { get; set; }
        [DBParameter("MarkerID")]
        public int MarkerID { get; set; }

    }
}
