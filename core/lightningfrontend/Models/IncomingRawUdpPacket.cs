using lightningContext;
using System.Net;

namespace lightningfrontend.Models
{
    public class IncomingRawUdpPacket
    {
        public IDetectionPacket Generate()
        {
            switch (GetPacketType())
            {
                case PacketType.Detection: return new DetectionDataPacket(this);
                case PacketType.Status: return new DetectionStatusPacket(this);

            }
            return null;
        }
        public byte[] RawBytes { get; set; }
        public IPAddress Address { get; private set; }
        public int Port { get; private set; }

        public IncomingRawUdpPacket(byte[] incomingByteArray)
        {
            RawBytes = incomingByteArray;
        }

        public async void StoreInDB()
        {
            Rawpacket packet = new Rawpacket();

            using (var context = new LightningContext())
            {
                context.Add(packet);
                await context.SaveChangesAsync();
            }
        }

        public PacketType GetPacketType()
        {
            if (RawBytes == null || RawBytes.Length < 3)
            {
                return PacketType.Unknown;
            }
            switch (RawBytes[3])
            {
                case 0: return PacketType.Detection;
                case 1:
                case 2:
                    return PacketType.Status;

            }
            return PacketType.Unknown;
        }

        internal void PopulateFromIncomingPacket(IPEndPoint remoteIpEndPoint)
        {
            Address = remoteIpEndPoint.Address;
            Port = remoteIpEndPoint.Port;
        }
    }
    public enum PacketType
    {
        Unknown,
        Status,
        Detection
    }


}
