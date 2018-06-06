using System;
using System.Collections.Generic;
using System.Linq;

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
                        deltaTime = rootDetector.DetectionTime - secondaryDetector.DetectionTime,
                        primary = rootDetector,
                        secondary = secondaryDetector
                    });
                }
                detectorDeltas = detectorDeltas.OrderBy(x => x.deltaTime).ToList();  // order by earliest heard
                foreach (var delta in detectorDeltas)
                {
                    Console.WriteLine($"Distance = {delta.GetKilometers()} K");
                    Console.WriteLine($"Time diff = {delta.deltaTime}");
                    if(delta.deltaTime>0)
                    {
                        //first detector heard it last
                    }
                }
            }
            return null;
        }
    }

    public struct DetectorDelta
    {
        internal double deltaLat;
        internal double deltaLon;
        internal decimal deltaTime;
        private enum DistanceMeasure
        {
            Kilometers,
            Nautical,
            Miles
        }

        public DetectionInstance secondary { get; internal set; }
        public DetectionInstance primary { get; internal set; }

        public double GetKilometers()
        {
            return Distance(primary.DetectorLat, primary.DetectorLon, secondary.DetectorLat, secondary.DetectorLon, DistanceMeasure.Kilometers);
        }
        private double Distance(double lat1, double lon1, double lat2, double lon2, DistanceMeasure unit)
        {
            double dist = Math.Sin(Deg2rad(lat1)) * Math.Sin(Deg2rad(lat2)) + Math.Cos(Deg2rad(lat1)) * Math.Cos(Deg2rad(lat2)) * Math.Cos(Deg2rad(lon1 - lon2));
            dist = Math.Acos(dist);
            dist = Rad2deg(dist);
            dist = dist * 60 * 1.1515;
            if (unit == DistanceMeasure.Kilometers)
            {
                dist = dist * 1.609344;
            }
            else if (unit == DistanceMeasure.Nautical)
            {
                dist = dist * 0.8684;
            }
            return (dist);
        }

        private double Deg2rad(double deg)
        {
            return (deg * Math.PI / 180.0);
        }
        private double Rad2deg(double rad)
        {
            return (rad / Math.PI * 180.0);
        }
    }

    public class Strike
    {
        public double StrikeLat { get; set; }
        public double StrikeLon { get; set; }
        public decimal StrikeTime { get; set; }

    }
    public class DetectionInstance
    {
        public double DetectorLat { get; set; }
        public double DetectorLon { get; set; }
        public decimal DetectionTime { get; set; }

    }
}
