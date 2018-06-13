using lightningContext;
using System;

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
        }

        public void StoreInDB()
        {
            if (!packet.IsReady()) throw new InvalidOperationException("Packet not constructed properly");
            try
            {


                using (var context = new LightningContext())
                {
                    context.Add(packet);
                    context.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

        }
    }


}
