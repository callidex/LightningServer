using System;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using lightningfrontend.DB;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

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
                .UseUrls("http://0.0.0.0:8080")
                .UseStartup<Startup>()
                .Build();

        public static void ServerThread()
        {
            UdpClient udpClient = new UdpClient(5000);
            while (true)
            {
                IPEndPoint RemoteIpEndPoint = new IPEndPoint(IPAddress.Any, 0);
                Models.IncomingRawUdpPacket potentialPacket = new Models.IncomingRawUdpPacket(udpClient.Receive(ref RemoteIpEndPoint));

                potentialPacket.PopulateFromIncomingPacket(RemoteIpEndPoint);
                Console.WriteLine($"{potentialPacket.GetPacketType().ToString()}");
                if (potentialPacket.GetPacketType() != Models.PacketType.Unknown)
                {

                    var newPacket = potentialPacket.Generate();
                    Console.WriteLine($"New packet incoming on thread {Thread.CurrentThread.ManagedThreadId} : {potentialPacket.IPAddress}:{potentialPacket.IPPort}");

                    Task.Run(() =>
                    {
                        using (var context = new lightningContext())
                        {
                            newPacket.StoreInDB(context);
                        }
                    });
                }
                else
                {
                    Task.Run(() => Console.WriteLine($"Unknown Packet incoming on thread {Thread.CurrentThread.ManagedThreadId}"));
                }
            }
        }

    }

}
