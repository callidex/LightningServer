using lightningContext;
using System;
using System.Threading;

namespace lightningfrontend.Models
{
    internal class DetectionStatusPacket : IDetectionPacket
    {
        private IncomingRawUdpPacket incomingRawUdpPacket;

        public DetectionStatusPacket(IncomingRawUdpPacket incomingRawUdpPacket)
        {
            this.incomingRawUdpPacket = incomingRawUdpPacket;
        }

        public async void StoreInDB()
        {
            Console.WriteLine($"Status Packet storing on thread {Thread.CurrentThread.ManagedThreadId}");

            //TODO: Strip out raw bytes into db object, EF push

            Statuspacket packet = new Statuspacket(this.incomingRawUdpPacket.RawBytes);
            using (var context = new LightningContext())
            {
                context.Add(packet);
                await context.SaveChangesAsync();
            }
        }
    }
}