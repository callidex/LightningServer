using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace lightningfrontend.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
   
    
        [HttpGet("[action]")]
        public IEnumerable<Detector> Detectors()
        {
            List<Detector> detectorList = new List<Detector>();

            LightningContext context = new LightningContext();
            var detectorIDs = context.Statuspackets.Select(s => new
            {
                s.Detectoruid,
                s.Gpslon,
                s.Gpslat,
                Received = s.Received??0

            }).Where(x=>x.Gpslon!=0 && x.Gpslat != 0).Distinct().GroupBy(x => x.Detectoruid).Select(x => x.Select(d => new Detector()
            {
                Name = d.Detectoruid.ToString(),
                Lat = (decimal)d.Gpslat,
                Lon = (decimal)d.Gpslon,
                Received = d.Received
            }));

            detectorList.AddRange(detectorIDs.SelectMany(x=>x.OrderByDescending(y=>y.Received).Take(1)));
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
