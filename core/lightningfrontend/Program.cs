using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace lightningfrontend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Thread thdUDPServer = new Thread(new ThreadStart(ServerThread));
            thdUDPServer.Start();

            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                  .UseUrls("http://0.0.0.0:5050")

                .UseStartup<Startup>()
                .Build();
        public static void ServerThread()
        {
            UdpClient udpClient = new UdpClient(8080);
            while (true)
            {
                IPEndPoint RemoteIpEndPoint = new IPEndPoint(IPAddress.Any, 0);
                Models.IncomingRawUdpPacket potentialPacket = new Models.IncomingRawUdpPacket(udpClient.Receive(ref RemoteIpEndPoint));

                potentialPacket.PopulateFromIncomingPacket(RemoteIpEndPoint);
                Console.WriteLine($"{potentialPacket.GetPacketType().ToString()}");
                Console.WriteLine($"Packet incoming on thread {Thread.CurrentThread.ManagedThreadId}");
                if (potentialPacket.GetPacketType() != Models.PacketType.Unknown)
                {
                    Task.Run(() => potentialPacket.Generate().StoreInDB());
                }
                else
                {
                    Task.Run(() => Console.WriteLine($"Unknown Packet incoming on thread {Thread.CurrentThread.ManagedThreadId}")
    );
                }
            }
        }

    }

}
