using lightningContext;
using System;

namespace lightningfrontend.Models
{
    public class DetectionDataPacket : IDetectionPacket
    {
        private IncomingRawUdpPacket incomingRawUdpPacket;
        private Datapacket packet;

        private DetectionDataPacket()
        {

        }

        public DetectionDataPacket(IncomingRawUdpPacket packetWrapper)
        {
            this.incomingRawUdpPacket = packetWrapper;
            packet = new Datapacket(packetWrapper.RawBytes);
        }

        public async void StoreInDB()
        {
            if (!packet.IsReady()) throw new InvalidOperationException("Packet not constructed properly");
            using (var context = new LightningContext())
            {
                context.Add(packet);
                await context.SaveChangesAsync();
            }
        }
    }


}
