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
        [TestMethod]
        public void BadStatusPacketTest()
        {
            var captureFilePath = "Packets\\emptystatuscapture.bin";
            byte[] testPacket = File.ReadAllBytes(captureFilePath);
            IncomingRawUdpPacket packet = new IncomingRawUdpPacket(testPacket);
            Assert.IsTrue(packet.GetPacketType() == PacketType.Status);
            DetectionStatusPacket statusPacket = (DetectionStatusPacket)packet.Generate();
            Assert.IsFalse(statusPacket.GetPacket().IsReady());

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
            Assert.IsTrue(statusPacket.IsReady());


            Assert.IsTrue(statusPacket.Gpsday == 2);
            Assert.IsTrue(statusPacket.Gpsmonth == 6);
            Assert.IsTrue(statusPacket.Gpshour == 6);
            Assert.IsTrue(statusPacket.Gpslat < -27);
            Assert.IsTrue(statusPacket.Gpslat > -28);

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

        [TestMethod]
        public void TOATest()
        {
            DetectionInstance strike1 = new DetectionInstance() { DetectorLat = 153.221, DetectorLon = -27.5604, DetectionTime = 0 };
            DetectionInstance strike2 = new DetectionInstance() { DetectorLat = 153.265, DetectorLon = -27.5583, DetectionTime = 0 };
            DetectionInstance strike3 = new DetectionInstance() { DetectorLat = 153.24211, DetectorLon = -27.5241, DetectionTime = 0 };

            var strikedetections = new System.Collections.Generic.List<DetectionInstance>
            {
                strike1,
                strike2,
                strike3
            };

            Strike final = TOACorrelator.Correlate(strikedetections);

        }
    }
}
