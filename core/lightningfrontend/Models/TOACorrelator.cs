
using lightningfrontend.DB;
using System;
using System.Collections.Generic;
using System.Linq;

namespace lightningfrontend.Models
{
    public struct Vector
    {
        public double Lon, Lat, Angle;
    }
    public static class TOACorrelator
    {
        private static readonly double SIGNALSPEED = (1 / 3e8);
        public static readonly double MAXDELAY = SIGNALSPEED * 50000;

        public static Strike Correlate(List<DetectionInstance> instances)
        {
            if (instances.Any())
            {
                // select the first (not in any order)
                var rootDetector = instances.OrderBy(x => x.DetectionTime).First();
                List<DetectorDelta> detectorDeltas = new List<DetectorDelta>();

                // create the intersections
                foreach (var secondaryDetector in instances.Where(x => x != rootDetector))
                {
                    var firstToHear = rootDetector.DetectionTime > secondaryDetector.DetectionTime ? rootDetector : secondaryDetector;
                    var secondToHear = rootDetector.DetectionTime > secondaryDetector.DetectionTime ? secondaryDetector : rootDetector;

                    detectorDeltas.Add(new DetectorDelta
                    {
                        deltaLat = rootDetector.DetectorLat - secondaryDetector.DetectorLat,
                        deltaLon = rootDetector.DetectorLon - secondaryDetector.DetectorLon,
                        deltaTime = rootDetector.DetectionTime - secondaryDetector.DetectionTime,
                        Primary = firstToHear,
                        Secondary = secondToHear,
                        Angle = Math.Atan2(secondToHear.DetectorLat - firstToHear.DetectorLat, secondToHear.DetectorLon - firstToHear.DetectorLon)
                    });
                }

                var strike = new Strike();

                detectorDeltas = detectorDeltas.OrderBy(x => x.deltaTime).ToList();
                foreach (var delta in detectorDeltas)
                {
                    var distance = delta.GetKilometers();
                    var timeDiff = delta.deltaTime;

                    // time diff is the radius of the 'circle of difference' and 'opposite of the RHTriangle'
                    var adjacent = timeDiff * SIGNALSPEED;
                    var hypotenuse = distance;

                    var opposite = Math.Sqrt((hypotenuse * hypotenuse) - (adjacent * adjacent));

                    // sin theta = O / H

                    var angleFromDetector = Math.Asin(opposite / hypotenuse);

                    // this angle represents the angle from normal between the two points, relative, get absolute.

                    var finalAngle = angleFromDetector + delta.Angle;

                    // as we are treating as a front, no curve, take detector 1 as point for now ( could work out midpoint of line between detectors)

                    
                    strike.Vectors.Add(new Vector() { Angle = finalAngle, Lat = delta.Primary.DetectorLat, Lon = delta.Primary.DetectorLon });
                }
                if (strike.Vectors.Any()) return strike;
            }
            return null;
        }
    }

    public struct DetectorDelta
    {
        internal double deltaLat;
        internal double deltaLon;
        internal double deltaTime;
        private enum DistanceMeasure
        {
            Kilometers,
            Nautical,
            Miles
        }

        public DetectionInstance Secondary { get; internal set; }
        public DetectionInstance Primary { get; internal set; }
        public double Angle { get; internal set; }

        public double GetKilometers()
        {
            return Distance(Primary.DetectorLat, Primary.DetectorLon, Secondary.DetectorLat, Secondary.DetectorLon, DistanceMeasure.Kilometers);
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
        public float StrikeLat { get; set; }
        public float StrikeLon { get; set; }
        public decimal StrikeTime { get; set; }
        public List<Vector> Vectors { get; internal set; } = new List<Vector>();
    }
    public class DetectionInstance
    {
        public float DetectorLat { get; set; }
        public float DetectorLon { get; set; }
        public double DetectionTime { get; set; }

        public static DetectionInstance FromPacket(Datapackets packet)
        {
            // Detection data packet has epoch, calc first peak, related status, create detection instance
            long possibleStrikeTime = packet.Received;

            var peakData = packet.Data.GetPeak();

            double possibleStrikeTimeDec = possibleStrikeTime + peakData.Item1 * 1 / 3.6e6;

            //TODO: pull out the peak from the datapacket and produce the detection time epoch
            //TODO: confirm time types
            return new DetectionInstance()
            {
                DetectionTime = possibleStrikeTimeDec
            };
        }
    }

    public static class PeakDetect
    {
        public static Tuple<int, UInt16> GetPeak(this byte[] data)
        {
            return new Tuple<int, ushort>(0, 0);
        }
    }
}
