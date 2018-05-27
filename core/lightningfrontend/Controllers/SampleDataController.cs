using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace lightningfrontend.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<Detector> Detectors()
        {
            List<Detector> l = new List<Detector>();

            lightningContext x = new lightningContext();
            var detectorIDs = x.Statuspackets.Select(s => new
            {
                s.Detectoruid,
                s.Gpslon,
                s.Gpslat
            }).Distinct();

            foreach (var d in detectorIDs)
            {
                l.Add(new Detector() { Name = d.Detectoruid.ToString(), Lat = (decimal)d.Gpslat, Lon = (decimal)d.Gpslon });

            }
            return l;
        }

        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

        public class Detector
        {
            public decimal Lat { get; set; }
            public decimal Lon { get; set; }

            public string Name { get; set; }

        }

        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
