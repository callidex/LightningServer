using lightningContext;
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
                        Primary = rootDetector,
                        Secondary = secondaryDetector
                    });
                }
                detectorDeltas = detectorDeltas.OrderBy(x => x.deltaTime).ToList();  // order by earliest heard
                foreach (var delta in detectorDeltas)
                {
                    var distance = delta.GetKilometers();
                    var timeDiff = delta.deltaTime;
                    Console.WriteLine(distance);
                    if (timeDiff > 0)
                    {
                        //first detector heard it last
                    }
                    else
                    {

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

        public DetectionInstance Secondary { get; internal set; }
        public DetectionInstance Primary { get; internal set; }

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
        public double StrikeLat { get; set; }
        public double StrikeLon { get; set; }
        public decimal StrikeTime { get; set; }

    }
    public class DetectionInstance
    {
        public double DetectorLat { get; set; }
        public double DetectorLon { get; set; }
        public decimal DetectionTime { get; set; }

        public static DetectionInstance FromPacket(Datapacket packet)
        {
            // Detection data packet has epoch, calc first peak, related status, create detection instance
            decimal possibleStrikeTime = packet.Epoch;

            var peakData = packet.Data.GetPeak();

            possibleStrikeTime += (decimal)peakData.Item1 * 1 / 3.6e6M;

            //TODO: pull out the peak from the datapacket and produce the detection time epoch
            //TODO: confirm time types
            return new DetectionInstance()
            {
                DetectionTime = possibleStrikeTime
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
