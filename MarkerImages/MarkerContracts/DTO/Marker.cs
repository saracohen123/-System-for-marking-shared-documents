using infraDALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
    public class Marker
    {
        [DBParameter("docID")]
        public int docID { get; set; }
        [DBParameter("MarkerType")]
        public string MarkerType { get; set; }
        [DBParameter("cx")]
        public double cx { get; set; }
        [DBParameter("cy")]
        public double cy { get; set; }
        [DBParameter("rx")]
        public double rx { get; set; }
        [DBParameter("ry")]
        public double ry { get; set; }
        [DBParameter("Fore")]
        public string Fore { get; set; }
        [DBParameter("userID")]
        public string userID { get; set; }
        [DBParameter("text")]
        public string text { get; set; }
        [DBParameter("MarkerID")]
        public int MarkerID { get; set; }
    }
}

