using lightningContext;
using System;
using System.IO;
using System.Threading;

namespace lightningfrontend.Models
{
    internal class DetectionStatusPacket : IDetectionPacket
    {
        private IncomingRawUdpPacket incomingRawUdpPacket;
        private Statuspacket packet;

        public DetectionStatusPacket(IncomingRawUdpPacket incomingRawUdpPacket)
        {
            this.incomingRawUdpPacket = incomingRawUdpPacket;
            packet = new Statuspacket(this.incomingRawUdpPacket.RawBytes);
        }

        public async void StoreInDB()
        {
            if (!packet.IsReady()) throw new InvalidDataException("Packet not constructed properly");
            using (var context = new LightningContext())
            {
                context.Add(packet);
                await context.SaveChangesAsync();
            }
        }
    }
}