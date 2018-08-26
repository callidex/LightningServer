using lightningContext;
using System;
using System.Linq;

namespace lightningfrontend.Models
{
    public class DetectionDataPacket : IDetectionPacket
    {
        private IncomingRawUdpPacket incomingRawUdpPacket;
        private Datapacket packet;
        public Datapacket GetPacket() => packet;


        private DetectionDataPacket()
        {


        }

        public DetectionDataPacket(IncomingRawUdpPacket packetWrapper)
        {
            this.incomingRawUdpPacket = packetWrapper;

            packet = new Datapacket(packetWrapper.RawBytes);
            packet.Address = incomingRawUdpPacket.IPAddress;
        }

        public void Process(LightningContext context)
        {
            var closePackets = context.Datapackets.Where(x => x.Received  > this.packet.Received - TOACorrelator.MAXDELAY);

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
                x.DetectionInstance.DetectorLat = x.Status.Gpslat;
                x.DetectionInstance.DetectorLon = x.Status.Gpslon;
            }

            Strike strike = TOACorrelator.Correlate(fullInfo.Select(x => x.DetectionInstance).ToList());

            if (strike != null)
            {
                context.Add(strike);
            }
        }


        public void StoreInDB(LightningContext context)
        {
            if (!packet.IsReady()) throw new InvalidOperationException("Packet not constructed properly");

            context.Add(packet);
            Process(context);
            context.SaveChanges();
        }
    }
}
