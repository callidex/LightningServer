using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace core.Controllers
{
    [Produces("application/json")]
    [Route("api/IncomingPacket")]
    public class IncomingPacketController : Controller
    {
        // GET: api/IncomingPacket
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/IncomingPacket/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/IncomingPacket
        [HttpPost]
        public void Post([FromBody]IncomingRawUdpPacket value)
        {
            Console.WriteLine(value?.ToString());
        }

        // PUT: api/IncomingPacket/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
