
using lightningfrontend.DB;
using System;
using System.IO;
using System.Threading;

namespace lightningfrontend.Models
{
   public class DetectionStatusPacket : IDetectionPacket
   {
      private readonly IncomingRawUdpPacket incomingRawUdpPacket;
      private Statuspackets packet;
      public Statuspackets GetPacket() => packet;

      public DetectionStatusPacket(IncomingRawUdpPacket incomingRawUdpPacket)
      {
         this.incomingRawUdpPacket = incomingRawUdpPacket;
         packet = new Statuspackets(this.incomingRawUdpPacket.RawBytes)
         {
            Received = DateTimeOffset.Now.ToUnixTimeSeconds(),
            Persisteddate = DateTime.Now.Ticks
         };
      }

      public void StoreInDB(LightningContext context)
      {
         if (!packet.IsReady()) throw new InvalidDataException("Packet not constructed properly");
         Console.WriteLine($"Status Packet storing on thread {Thread.CurrentThread.ManagedThreadId}");
         try
         {
            context.Add(packet);
            context.SaveChanges();
         }
         catch (Exception e)
         {
            if (e.InnerException != null)
            {
               Console.WriteLine($"{e.InnerException.Message}  : storing status");
            }
            else Console.WriteLine($"{e.Message}  : storing status");
         }
      }

      public void Process(LightningContext context)
      {
         throw new NotImplementedException();
      }
   }
}