
using lightningfrontend.DB;
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
        public string IPAddress { get; set; }
        public int IPPort { get; private set; }

        public IncomingRawUdpPacket(byte[] incomingByteArray)
        {
            RawBytes = incomingByteArray;
        }

        public void StoreInDB()
        {
            Rawpackets packet = new Rawpackets
            {
                Data = RawBytes,
                Port = IPPort.ToString(),
                Address = IPAddress.ToString(),
            };
            using (var context = new lightningContext())
            {
                context.Add(packet);
                context.SaveChanges();
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
            IPAddress = remoteIpEndPoint.Address.ToString();
            IPPort = remoteIpEndPoint.Port;
        }
    }
    public enum PacketType
    {
        Unknown,
        Status,
        Detection
    }


}
