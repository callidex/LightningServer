using lightningfrontend.DB;
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
      public void StrikeTest()
      {
         using (var context = new LightningContext())
         {
            var t = context.Datapackets.Join(context.Datapackets, x => x.Received, y => y.Received, (x, y) => new { Left = x, Right = y });


            var s = t.Where(x => x.Left.Received == x.Right.Received).Where(x => x.Left.Detectoruid > x.Right.Detectoruid)
            .Select(x =>
                           new
                           {
                              lID = x.Left.Detectoruid,
                              rID = x.Right.Detectoruid,
                              lTime = x.Left.Received,
                              rTime = x.Right.Received
                           }).ToArray();

            if (t.Any())
            {
               var st = s.Select(x => new Strike() { StrikeTime = x.lTime }).ToArray();

            }
         }

      }


      [TestMethod]
      public void DataPacketTest()
      {
         var captureFilePath = "Packets\\Raw3.bin";
         byte[] testPacket = File.ReadAllBytes(captureFilePath).ToArray();

         Assert.IsNotNull(testPacket);
         Assert.IsTrue(testPacket.Length > 0);

         IncomingRawUdpPacket packet = new IncomingRawUdpPacket(testPacket);
         Assert.IsTrue(packet.GetPacketType() == PacketType.Detection);
         packet.IPAddress = "1.1.1.1";
         DetectionDataPacket detPacket = ((DetectionDataPacket)packet.Generate());
         Assert.IsNotNull(detPacket);

         var detectionPacket = detPacket.GetPacket();
         Assert.IsTrue(detectionPacket.IsReady());

         // from analysis (delphi)
         Assert.AreEqual(1002, detectionPacket.Detectoruid);
         Assert.AreEqual(293, detectionPacket.Packetnumber);
         Assert.AreEqual(51, detectionPacket.Batchid);
         Assert.AreEqual((System.Int32)0, (System.Int32)detectionPacket.Received - 1527921364);
      }


      [TestMethod]
      public void StatusPacketTest()
      {
         var captureFilePath = "Packets\\Raw3.bin";
         byte[] testPacketAll = File.ReadAllBytes(captureFilePath);
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

         IncomingRawUdpPacket packet = new IncomingRawUdpPacket(testPacket)
         {
            IPAddress = "0.0.0.0"
         };
         Assert.IsTrue(packet.GetPacketType() == PacketType.Detection);

         IDetectionPacket p = packet.Generate();
         Assert.IsNotNull(p);
      }

      [TestMethod]
      public void TOATest()
      {
         DetectionInstance strike1 = new DetectionInstance() { DetectorLat = (float)153.221, DetectorLon = (float)-27.5604, DetectionTime = 0 };
         DetectionInstance strike2 = new DetectionInstance() { DetectorLat = (float)153.265, DetectorLon = (float)-27.5583, DetectionTime = 0 };
         DetectionInstance strike3 = new DetectionInstance() { DetectorLat = (float)153.24211, DetectorLon = (float)-27.5241, DetectionTime = 0 };

         var strikedetections = new System.Collections.Generic.List<DetectionInstance>
            {
                strike1,
                strike2,
                strike3
            };

         Strike final = TOACorrelator.Correlate(strikedetections);

         Assert.IsNotNull(final);


      }

      byte[] testSignal = { 100, 100, 100, 128, 100, 145, 70, 140, 0 };

      [TestMethod]
      public void MaxPeakTest()
      {
         var peaks = PeakDetect.GetPeaks(testSignal);
         Assert.IsTrue(peaks.First().Item1 == 3);
         Assert.IsTrue(peaks.First().Item2 == 128);

         var first = PeakDetect.GetFirstPeak(peaks);
         var max = PeakDetect.GetMaxPeak(peaks);

         Assert.IsTrue(first.Item1 == 3);
         Assert.IsTrue(first.Item2 == 128);

         Assert.IsTrue(max.Item1 == 5);
         Assert.IsTrue(max.Item2 == 145);

         var steepest = PeakDetect.SteepestPeak(testSignal);

         Assert.IsTrue(max.Item1 == 7);
         Assert.IsTrue(max.Item2 == 70);


      }

   }
}
