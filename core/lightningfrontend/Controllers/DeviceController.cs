using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace lightningfrontend.Controllers
{
    [Route("api/[controller]")]
    public class DeviceController : Controller
    {
        [HttpGet("{name}")]
        public int Register(string unique)
        {
            var detector = "0";
            // check db for existing DetectorID
            using (var context = new lightningfrontend())
            {
                var found = context.Detectors.Where(x => x.Unique == unique).FirstOrDefault();
                if (found != null)
                {
                    return found.ID;
                }
                else
                {
                    var nextId = context.Detectors.DefaultIfEmpty(1).Sum(x => x.ID);
                    context.Detectors.Add(new Detector() { ID = nextId, unique = unique });
                    return nextId;
                }
            }
            // if found return

            // else increment (get max+1)

            return detectorID;
        }


    }
}
