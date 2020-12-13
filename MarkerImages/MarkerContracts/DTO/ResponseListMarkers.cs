using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.DTO
{
  public  class ResponseListMarkers:ResponseOK
    {
        public List<Marker> lst { get; set; }
    }
}
