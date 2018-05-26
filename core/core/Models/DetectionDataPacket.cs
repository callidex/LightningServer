using System;
using System.Threading;

namespace core.Models
{
    public class DetectionDataPacket : IDetectionPacket
    {
        private IncomingRawUdpPacket incomingRawUdpPacket;

        public DetectionDataPacket(IncomingRawUdpPacket incomingRawUdpPacket)
        {
            this.incomingRawUdpPacket = incomingRawUdpPacket;
        }

        public void StoreInDB()
        {
            Console.WriteLine($"Data Packet storing on thread {Thread.CurrentThread.ManagedThreadId}");

            throw new NotImplementedException();
        }
    }


}
