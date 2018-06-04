using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lightningfrontend.Models
{
    public static class TOACorrelator
    {

        public static Strike Correlate(List<DetectionInstance> instances)
        {
            if (instances.Any())
            {
                // select the first (not in any order)
                var rootDetector = instances.First();
                List<DetectorDelta> detectorDeltas = new List<DetectorDelta>();

                // create the intersections
                foreach (var secondaryDetector in instances.Where(x => x != rootDetector))
                {
                    detectorDeltas.Add(new DetectorDelta
                    {
                        deltaLat = rootDetector.DetectorLat - secondaryDetector.DetectorLat,
                        deltaLon = rootDetector.DetectorLon - secondaryDetector.DetectorLon,
                        deltaTime = rootDetector.DetectionTime - secondaryDetector.DetectionTime
                    });
                }

                foreach (var delta in detectorDeltas)
                {

                }
            }
            return null;
        }
    }

    public struct DetectorDelta
    {
        internal decimal deltaLat;
        internal decimal deltaLon;
        internal decimal deltaTime;
    }

    public class Strike
    {
        public decimal StrikeLat { get; set; }
        public decimal StrikeLon { get; set; }
        public decimal StrikeTime { get; set; }

    }
    public class DetectionInstance
    {
        public decimal DetectorLat { get; set; }
        public decimal DetectorLon { get; set; }
        public decimal DetectionTime { get; set; }

    }
}
