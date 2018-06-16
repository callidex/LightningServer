using lightningContext;
using System;
using System.IO;
using System.Threading;

namespace lightningfrontend.Models
{
    public class DetectionStatusPacket : IDetectionPacket
    {
        private IncomingRawUdpPacket incomingRawUdpPacket;
        private Statuspacket packet;
        public Statuspacket GetPacket() => packet;

        public DetectionStatusPacket(IncomingRawUdpPacket incomingRawUdpPacket)
        {
            this.incomingRawUdpPacket = incomingRawUdpPacket;
            packet = new Statuspacket(this.incomingRawUdpPacket.RawBytes);

        }

        public void StoreInDB()
        {
            if (!packet.IsReady()) throw new InvalidDataException("Packet not constructed properly");
            Console.WriteLine($"Status Packet storing on thread {Thread.CurrentThread.ManagedThreadId}");
            using (var context = new LightningContext())
            {
                context.Add(packet);
                context.SaveChanges();
            }
        }

        public void Process()
        {
            throw new NotImplementedException();
        }
    }
}