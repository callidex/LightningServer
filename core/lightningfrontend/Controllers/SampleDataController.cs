using lightningfrontend.DB;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace lightningfrontend.Controllers
{
   [Route("api/[controller]")]
   public class SampleDataController : Controller
   {
      [HttpGet("[action]")]
      public InfoDump GetInfoDump()
      {
         using (var context = new lightningContext())
         {
            InfoDump dump = new InfoDump();
            dump.StatusPacketCount = context.Statuspackets.Count();
            dump.DataPacketCount = context.Datapackets.Count();
            dump.DetectorCount = context.Detectors.Count();
            return dump;
         }
      }
      [HttpGet("[action]")]
      public long RealtimeDataPacketCount()
      {
         using (var context = new lightningContext())
         {
           return context.Datapackets.Count(x => x.Persisteddate > DateTime.Now.AddSeconds(-5).Ticks);
         }
      }

      [HttpGet("[action]")]
      public long RealtimeStatusPacketCount()
      {
         using (var context = new lightningContext())
         {
            return context.Statuspackets.Count(x => x.Persisteddate > DateTime.Now.AddSeconds(-5).Ticks);
         }
      }


      [HttpGet("[action]")]
      public IEnumerable<Signal> Signals()
      {
         using (var context = new lightningContext())
         {
            var output = new List<Signal>();

            var results = (from d in context.Datapackets.OrderByDescending(x => x.Id)
                           join detector in context.Detectors on d.Detectoruid equals detector.Id

                           select new { d.Data, detectorName = detector.Name, d.Received, d.Id }).Take(30);

            foreach (var d in results.ToList())

            {
               var o = new ushort[728];
               Buffer.BlockCopy(d.Data, 0, o, 0, 1456);
               output.Add(new Signal() { Data = o, Detector = d.detectorName, Received = d.Received, ReceivedString = FromUnixTime(d.Received).ToString(), Id = d.Id }
               );
            };
            return output;
         }
      }


      [HttpGet("[action]")]
      public IEnumerable<Strike> Strikes()
      {
         using (var context = new lightningContext())
         {
            var t = context.Datapackets.Join(context.Datapackets, x => x.Received, y => y.Received, (x, y) => new { Left = x, Right = y })
                .Where(x => x.Left.Detectoruid != x.Right.Detectoruid)
                .Where(x => x.Left.Received == x.Right.Received)
                .Select(x =>
                 new
                 {
                    lID = x.Left.Detectoruid,
                    rID = x.Right.Detectoruid,
                    lTime = x.Left.Received,
                    rTime = x.Right.Received
                 }).Take(10).ToArray();

            if (t.Any())
            {
               return t.Select(x => new Strike() { Received = x.lTime }).ToArray();

            }
            return null;
         }
      }

      [HttpGet("[action]")]
      public IEnumerable<Detector> Detectors()
      {
         List<Detector> detectorList = new List<Detector>();

         using (var context = new lightningContext())
         {
            var detectorIDs = (from sp in context.Statuspackets
                               join det in context.Detectors
                               on sp.Detectoruid equals det.Id

                               select new
                               {
                                  sp.Detectoruid,
                                  sp.Gpslon,
                                  sp.Gpslat,
                                  sp.Received,
                                  det.Name

                               }).Where(x => x.Gpslon != 0 && x.Gpslat != 0).Distinct().GroupBy(x => x.Detectoruid).Select(x => x.Select(d => new Detector()
                               {
                                  Name = d.Name,
                                  Lat = d.Gpslat,
                                  Lon = d.Gpslon,
                                  Received = d.Received,
                                  ReceivedString = FromUnixTime(d.Received ?? 0).ToString()
                               }));

            detectorList.AddRange(detectorIDs.SelectMany(x => x.OrderByDescending(y => y.Received).Take(1)));
         }
         return detectorList;
      }



      public class Strike
      {
         public float? Lat { get; set; }
         public float? Lon { get; set; }
         public long? Received { get; set; }
         public string ReceivedString { get; set; }

      }

      public class Detector : Strike
      {
         public string Name { get; set; }

      }

      public class Signal
      {
         public UInt16[] Data;
         public string Detector;
         public long? Received { get; set; }
         public string ReceivedString { get; set; }
         public long Id;
      }
      private DateTime FromUnixTime(long unixTime)
      {
         return new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(unixTime);

      }
   }

   public class InfoDump
   {
      public int DataPacketCount { get; internal set; }
      public int StatusPacketCount { get; internal set; }
      public int DetectorCount { get; internal set; }
   }
}
