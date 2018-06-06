using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace lightningfrontend.Controllers
{
    [Route("api/[controller]")]
    public class DeviceController : Controller
    {
        [HttpGet("{unique}")]
        public int Register(string unique)
        {
            if (unique == null) return 0;
            // check db for existing DetectorID
            using (var context = new LightningContext())
            {
                var found = context.DetectorRegistrations.Where(x => x.UniqueDeviceCode == unique).FirstOrDefault();
                if (found != null)
                {
                    return found.ID;
                }
                else
                {
                    var nextId = context.DetectorRegistrations.Sum(x => x.ID)+1;
                    context.DetectorRegistrations.Add(new DetectorRegistration() { ID = nextId, UniqueDeviceCode = unique });
                    context.SaveChangesAsync();
                    return nextId;
                }
            }
        }
    }
}
