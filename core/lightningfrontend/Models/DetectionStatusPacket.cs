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

        public void StoreInDB()
        {
            Console.WriteLine($"Status Packet storing on thread {Thread.CurrentThread.ManagedThreadId}");

            throw new System.NotImplementedException();
        }
    }
}