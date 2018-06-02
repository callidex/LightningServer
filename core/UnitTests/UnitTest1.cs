using lightningfrontend;
using lightningfrontend.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;

namespace UnitTests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void StatusPacketTest()
        {
            var captureFilePath = "";
            using (var lightningContext = new LightningContext())
            {

                byte[] testPacket = File.ReadAllBytes(captureFilePath);

                IncomingRawUdpPacket packet = new IncomingRawUdpPacket(testPacket);
                Assert.IsTrue(packet.GetPacketType() == PacketType.Status);

                IDetectionPacket statusPacket = packet.Generate();


            }

        }
    }
}
