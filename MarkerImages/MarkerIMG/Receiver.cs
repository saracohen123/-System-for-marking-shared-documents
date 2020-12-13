using MarkerContracts.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MarkerIMG
{
    public class Receiver:IReceiver
    {
        Task _recTask;
        WebSocket _webSocket;
        public Receiver(WebSocket webSocket)
        {
            _webSocket = webSocket;
        }
        public void Start()
        {
            _recTask = new Task(async () =>
            {
                for (; ; )
                {
                    var buffer = new byte[4096];
                    var response = await _webSocket.ReceiveAsync(new Memory<byte>(buffer), CancellationToken.None);
                    if (response.MessageType == WebSocketMessageType.Close)
                    {
                        break;
                    }
                    else
                    {
                        Console.WriteLine(Encoding.UTF8.GetString(buffer));
                    }

                }


            });
            _recTask.Start();
        }


    }
}
