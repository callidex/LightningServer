using System;
using System.Collections.Generic;
using System.Linq;
using lightningContext;
using Microsoft.AspNetCore.Mvc;

namespace lightningfrontend.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<UInt16[]> Signals()
        {
            using (var context = new LightningContext())
            {
                var output = new List<UInt16[]>();
                foreach (var d in context.Datapackets.OrderByDescending(x => x.Id).Take(10).Select(x => x.Data)
                    .ToList())
                {
                    var o = new UInt16[728];
                    Buffer.BlockCopy(d, 0, o, 0, 1456);
                    output.Add(o);
                };
                return output;
            }
        }

        [HttpGet("[action]")]
        public IEnumerable<Detector> Detectors()
        {
            List<Detector> detectorList = new List<Detector>();

            using (var context = new LightningContext())
            {
                var detectorIDs = (from sp in context.Statuspackets join det in context.DetectorRegistrations on 
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

        public class Detector
        {
            public decimal Lat { get; set; }
            public decimal Lon { get; set; }
            public long Received { get; set; }
            public string Name { get; set; }

        }
    }
}
