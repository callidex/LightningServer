using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

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
                foreach (var d in context.Datapackets.OrderByDescending(x => x.Id).Take(10).Select(x => new { x.Data, x.Detectoruid, x.Epoch, x.Id })
                    .ToList())
                {
                    var o = new UInt16[728];
                    Buffer.BlockCopy(d.Data, 0, o, 0, 1456);
                    output.Add(new Signal() { Data = o, Detector = d.Detectoruid, Received = d.Epoch, Id = d.Id }
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
                                       Received = d.Received
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

        }

        public class Detector : Strike
        {
            public string Name { get; set; }

        }

        public class Signal
        {
            public UInt16[] Data;
            public long Detector;
            public uint Received;
            public long Id;
        }

    }
}
