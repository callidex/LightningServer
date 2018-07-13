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

                    //Store the raw packet

                    //Disabled storing whole raw packet for now
                    //Task.Run(() => potentialPacket.StoreInDB());

                    //Process and store the generated packet
                    Task.Run(() =>
                    {
                        using (var context = new LightningContext())
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
