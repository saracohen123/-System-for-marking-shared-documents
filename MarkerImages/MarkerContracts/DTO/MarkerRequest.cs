using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
    public class MarkerRequest
    {
        [DBParameter("MarkerID")]
        public int MarkerID { get; set; }
    }
}
