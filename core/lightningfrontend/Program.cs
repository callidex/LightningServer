using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using lightningfrontend.DB;
using lightningfrontend.Models;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
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
            .ConfigureLogging(logging =>
            {
               logging.ClearProviders();
               logging.AddConsole();
            })
              .Build();

      public static List<DetectionDataPacket> FindStrike(List<DetectionDataPacket> data)
      {
         if (data == null) return null;
         // TODO:
         // for now return the latest only  (this will result in attempts to add the same entry more than once, the DB will reject it
         // NOTE:  If you find a strike here with say 3, we should leave the data here, in case 4 and 5 give better accuracy?
         return data.OrderByDescending(x => x.GetPacket().Received).Take(1).ToList();
      }

      public static void ServerThread()
      {
         var dataPacketBuffer = new List<DetectionDataPacket>();

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

               // Throw in buffer
               var dPacket = newPacket as DetectionDataPacket;
               if (dPacket != null)
               {
                  dataPacketBuffer.Add(dPacket);
                  //TODO: If coincedent, keep it, else wait till it ages
                  var data = FindStrike(dataPacketBuffer);
                  data.ForEach(x => dataPacketBuffer.Remove(x));
                  if (data != null)
                  {
                     Task.Run(() =>
                     {
                        using (var context = new lightningContext())
                        {
                           foreach (var d in data)
                           {
                              d.StoreInDB(context);
                           }
                        }
                     });
                  }

                  dataPacketBuffer.RemoveAll(x => x.GetPacket().Persisteddate < DateTime.Now.AddMilliseconds(-500).Ticks);
               }
               else
               {
                  Task.Run(() =>
                  {
                     using (var context = new lightningContext())
                     {
                        newPacket.StoreInDB(context);
                     }
                  });
               }
            }
            else
            {
               Task.Run(() => Console.WriteLine($"Unknown Packet incoming on thread {Thread.CurrentThread.ManagedThreadId}"));
            }
         }
      }

   }

}
