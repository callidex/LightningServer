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
        public IEnumerable<Signal> Signals()
        {
            using (var context = new LightningContext())
            {
                var output = new List<Signal>();
                foreach (var d in context.Datapackets.OrderByDescending(x => x.Id).Take(10).Select(x => new { x.Data, x.Detectoruid, x.Received, x.Id })
                    .ToList())
                {
                    var o = new UInt16[728];
                    Buffer.BlockCopy(d.Data, 0, o, 0, 1456);
                    output.Add(new Signal() { Data = o, Detector = d.Detectoruid, Received = d.Received ?? 0, ReceivedString = FromUnixTime(d.Received ?? 0).ToString(), Id = d.Id }
                    );
                };
                return output;
            }
        }


        [HttpGet("[action]")]
        public IEnumerable<Strike> Strikes()
        {
            List<Strike> strikelist = new List<Strike>();

            strikelist.Add(new Strike { Received = 111111, Lat = 50, Lon = -20 });
            strikelist.Add(new Strike { Received = 111111, Lat = -50, Lon = -20 });
            strikelist.Add(new Strike { Received = 111111, Lat = 50, Lon = 20 });
            strikelist.Add(new Strike { Received = 111111, Lat = -50, Lon = 20 });

            return strikelist;
        }


        [HttpGet("[action]")]
        public IEnumerable<Detector> Detectors()
        {
            List<Detector> detectorList = new List<Detector>();

            using (var context = new LightningContext())
            {
                var detectorIDs = (from sp in context.Statuspackets
                                   join det in context.DetectorRegistrations on
 sp.Detectoruid equals det.ID
                                   select new

                                   {
                                       sp.Detectoruid,
                                       sp.Gpslon,
                                       sp.Gpslat,
                                       Received = sp.Received ?? 0

                                   }).Where(x => x.Gpslon != 0 && x.Gpslat != 0).Distinct().GroupBy(x => x.Detectoruid).Select(x => x.Select(d => new Detector()
                                   {
                                       Name = d.Detectoruid.ToString(),
                                       Lat = (decimal)d.Gpslat,
                                       Lon = (decimal)d.Gpslon,
                                       Received = d.Received,
                                       ReceivedString = FromUnixTime(d.Received).ToString()
                                   }));

                detectorList.AddRange(detectorIDs.SelectMany(x => x.OrderByDescending(y => y.Received).Take(1)));
            }
            return detectorList;
        }



        public class Strike
        {
            public decimal Lat { get; set; }
            public decimal Lon { get; set; }
            public long Received { get; set; }
            public string ReceivedString { get; set; }

        }

        public class Detector : Strike
        {
            public string Name { get; set; }

        }

        public class Signal
        {
            public UInt16[] Data;
            public long Detector;
            public long Received { get; set; }
            public string ReceivedString { get; set; }
            public long Id;
        }
        private DateTime FromUnixTime(long unixTime)
        {
            return new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(unixTime);

        }
    }
}
