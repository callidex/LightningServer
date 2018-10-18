using lightningfrontend.DB;
using System;
using System.Linq;

namespace lightningfrontend.Models
{
   public class DetectionDataPacket : IDetectionPacket
   {
      private IncomingRawUdpPacket incomingRawUdpPacket;
      private Datapackets packet;
      public Datapackets GetPacket() => packet;


      private DetectionDataPacket()
      {


      }

      public DetectionDataPacket(IncomingRawUdpPacket packetWrapper)
      {
         this.incomingRawUdpPacket = packetWrapper;

         packet = new Datapackets(packetWrapper.RawBytes);
         packet.Address = incomingRawUdpPacket.IPAddress;
      }

      public void Process(lightningContext context)
      {
         var closePackets = context.Datapackets.Where(x => x.Received > this.packet.Received - TOACorrelator.MAXDELAY);

         var fullInfo = (from data in closePackets
                         join
                           status in context.Statuspackets
                           on data.Batchid equals status.Batchid
                         select new
                         {
                            DetectionInstance = DetectionInstance.FromPacket(data),
                            Status = status
                         }).ToList();
         foreach (var x in fullInfo)
         {
            x.DetectionInstance.DetectorLat = x.Status.Gpslat.Value;
            x.DetectionInstance.DetectorLon = x.Status.Gpslon.Value;
         }

         Strike strike = TOACorrelator.Correlate(fullInfo.Select(x => x.DetectionInstance).ToList());

         if (strike != null)
         {
            context.Add(strike);
         }
      }


      public void StoreInDB(lightningContext context)
      {
         if (!packet.IsReady()) throw new InvalidOperationException("Packet not constructed properly");

         context.Add(packet);
         Process(context);
         context.SaveChanges();
      }
   }
}
