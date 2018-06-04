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
                var rootDetector = instances.First();

                List<DetectorDelta> detectorDeltas = new List<DetectorDelta>();

                foreach (var secondaryDetector in instances.Where(x => x != rootDetector))
                {
                    detectorDeltas.Add(new DetectorDelta
                    {
                        deltaLat = rootDetector.detectorLat - secondaryDetector.detectorLat,
                        deltaLon = rootDetector.detectorLon - secondaryDetector.detectorLon,
                        deltaTime = rootDetector.detectionTime - secondaryDetector.detectionTime
                    });
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
        public decimal strikeLat { get; set; }
        public decimal strikeLon { get; set; }
        public decimal strikeTime { get; set; }

    }
    public class DetectionInstance
    {
        public decimal detectorLat { get; set; }
        public decimal detectorLon { get; set; }
        public decimal detectionTime { get; set; }

    }
}
