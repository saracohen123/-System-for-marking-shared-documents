using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MarkerIMG
{
    public class WebSocketMessangerAdapter : IMessanger
    {//1-userid
     //2-doc
        Dictionary<Tuple<string, string>, WebSocket> _sockets;
        Dictionary<string, Receiver> _receivers;

        public WebSocketMessangerAdapter()
        {

            _sockets = new Dictionary<Tuple<string, string>, WebSocket>();
        }
        public async Task Send(string userid,string docid, string messageBody)
        {

            if (_sockets.Keys.Where(it => it.Item2 == docid).Count() > 0)
            {
                var message = JsonConvert.SerializeObject(messageBody);
                var buffer = Encoding.UTF8.GetBytes(message);
                //var list=  _sockets.sel(it => it.Value == id).ToList();
                foreach (var item in _sockets)
                {
                    //תשלח לכולם חוץ ממי ששלח 
                    if (item.Key.Item2 == docid&& item.Key.Item1!= userid)
                    {
                     await item.Value.SendAsync(new ReadOnlyMemory<byte>(buffer), WebSocketMessageType.Text
                   , true
                   , CancellationToken.None);
                    }

                }
               


                //await _sockets[id].SendAsync(new ReadOnlyMemory<byte>(buffer), WebSocketMessageType.Text
                //    , true
                //   , CancellationToken.None);
            }
        }
        public async Task<IReceiver> Add(string userid,string docid, ISocket socket)
        {
            var webSocketAdapter = socket as WebSocketAdapter;
            Receiver retval = null;

            if (_sockets.Keys.Where(it=>it.Item1==userid).Count()>0)
            {
                //1-userid
                //2-docid
                // var cursocket = _sockets[webSocketAdapter.Socket];
                _sockets.Remove(new Tuple<string,string>(userid,docid));
                //await cursocket.CloseAsync(WebSocketCloseStatus.Empty, "Remote Closed", CancellationToken.None);

            }
            _sockets.Add(new Tuple<string, string>(userid, docid),webSocketAdapter.Socket);
            retval = new Receiver(webSocketAdapter.Socket);
            return retval;
        }

     
    }
}
