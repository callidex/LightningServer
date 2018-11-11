using System.Linq;
using lightningfrontend.DB;
using Microsoft.AspNetCore.Mvc;

namespace lightningfrontend.Controllers
{
   [Route("api/[controller]")]
   public class DeviceController : Controller
   {
      [HttpGet("{unique}")]
      public uint Register(string unique)
      {
         if (unique == null) return 0;
         // check db for existing DetectorID
         using (var context = new LightningContext())
         {
            var found = context.Detectors.Where(x => x.Devicecode == unique).Select(x=>x.Id).FirstOrDefault();
            if (found != 0)
            {
               return found;
            }
            else
            {
               var nextId = context.Detectors.Max(x => x.Id) + 1;
               context.Detectors.Add(new Detectors() { Id = nextId, Devicecode = unique });
               context.SaveChanges();
               return nextId;
            }
         }
      }
   }
}
