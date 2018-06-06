using lightningContext;
using lightningfrontend;
using lightningfrontend.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;
using System.Linq;

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
            var captureFilePath = "Packets\\Raw3.bin";
            byte[] testPacketAll = File.ReadAllBytes(captureFilePath)
                ;
            byte[] testPacket = testPacketAll.Skip(1472).ToArray();
            Assert.IsNotNull(testPacket);
            Assert.IsTrue(testPacket.Length > 0);

            IncomingRawUdpPacket packet = new IncomingRawUdpPacket(testPacket);
            Assert.IsTrue(packet.GetPacketType() == PacketType.Status);

            DetectionStatusPacket detPacket = ((DetectionStatusPacket)packet.Generate());
            Assert.IsNotNull(detPacket);

            var statusPacket = detPacket.GetPacket();

            Assert.IsTrue(statusPacket.Gpsday == 2);
            Assert.IsTrue(statusPacket.Gpsmonth == 6);
            Assert.IsTrue(statusPacket.Gpshour == 6);
            Assert.IsTrue(statusPacket.Gpslat == -275603936);

        }

        [TestMethod]
        public void DetectionPacketTest()
        {
            var captureFilePath = "Packets\\Raw3.bin";
            byte[] testPacket = File.ReadAllBytes(captureFilePath);
            Assert.IsNotNull(testPacket);
            Assert.IsTrue(testPacket.Length > 0);

            IncomingRawUdpPacket packet = new IncomingRawUdpPacket(testPacket);
            Assert.IsTrue(packet.GetPacketType() == PacketType.Detection);

            IDetectionPacket statusPacket = packet.Generate();
            Assert.IsNotNull(statusPacket);
            using (var lightningContext = new LightningContext())
            {

            }

        }

    }
}
