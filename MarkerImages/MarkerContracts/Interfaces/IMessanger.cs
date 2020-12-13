using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MarkerContracts.Interfaces
{
    public interface IMessanger
    {
        Task Send(string userid,string docid, string message);
        Task<IReceiver> Add(string userid, string docid, ISocket socket);
    }
}
