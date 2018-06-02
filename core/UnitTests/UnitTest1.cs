using lightningfrontend;
using lightningfrontend.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;

namespace UnitTests
{
    [TestClass]
    public class UnitTest1
    {

        [TestMethod, ExpectedException(typeof(InvalidDataException))]
        public void BadStatusPacketTest()
        {
            var captureFilePath = "Packets\\emptystatuscapture.bin";
            byte[] testPacket = File.ReadAllBytes(captureFilePath);
            IncomingRawUdpPacket packet = new IncomingRawUdpPacket(testPacket);
            Assert.IsTrue(packet.GetPacketType() == PacketType.Status);
            IDetectionPacket statusPacket = packet.Generate();

        }
        [TestMethod]
        public void StatusPacketTest()
        {
            var captureFilePath = "Packets\\statuscapture.bin";
            byte[] testPacket = File.ReadAllBytes(captureFilePath);
            Assert.IsNotNull(testPacket);
            Assert.IsTrue(testPacket.Length > 0);

            IncomingRawUdpPacket packet = new IncomingRawUdpPacket(testPacket);
            Assert.IsTrue(packet.GetPacketType() == PacketType.Status);

            IDetectionPacket statusPacket = packet.Generate();
            Assert.IsNotNull(statusPacket);
            using (var lightningContext = new LightningContext())
            {

            }

        }
    }
}
