
using lightningfrontend.DB;
using System;
using System.IO;
using System.Threading;

namespace lightningfrontend.Models
{
    public class DetectionStatusPacket : IDetectionPacket
    {
        private IncomingRawUdpPacket incomingRawUdpPacket;
        private Statuspackets packet;
        public Statuspackets GetPacket() => packet;

        public DetectionStatusPacket(IncomingRawUdpPacket incomingRawUdpPacket)
        {
            this.incomingRawUdpPacket = incomingRawUdpPacket;
            packet = new Statuspackets(this.incomingRawUdpPacket.RawBytes);
            packet.Received = DateTimeOffset.Now.ToUnixTimeSeconds();
        }

        public void StoreInDB(lightningContext context)
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

        public void Process(lightningContext context)
        {
            throw new NotImplementedException();
        }
    }
}