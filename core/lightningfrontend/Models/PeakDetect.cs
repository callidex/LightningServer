using System;
using System.Collections.Generic;
using System.Linq;

namespace lightningfrontend.Models
{
   public static class PeakDetect
   {
      public static List<Tuple<int, ushort>> GetPeaks(this byte[] data)
      {
         var results = new List<Tuple<int, ushort>>();

         for (int i = 1; i < data.Length - 1; i++)
         {
            if (data[i] > data[i - 1] && data[i] > data[i + 1])
               results.Add(new Tuple<int, ushort>(i, data[i]));
         }
         return results;
      }

      public static Tuple<int, ushort> GetMaxPeak(List<Tuple<int, ushort>> peaks)
      {
         return peaks.Where(x => x.Item2 == peaks.Max(y => y.Item2)).First();

      }
      public static Tuple<int, ushort> GetFirstPeak(List<Tuple<int, ushort>> peaks)
      {
         return peaks.First();
      }

      public static Tuple<int, ushort> SteepestPeak(byte[] testSignal)
      {
         byte maxDiff = 0;
         int maxDiffIndex = -1;
         for (int i = 1; i < testSignal.Length - 1; i++)
         {
            if (testSignal[i] > testSignal[i - 1] && testSignal[i] > testSignal[i + 1])
            {
               var localDiff = testSignal[i] - testSignal[i - 1];
               if (localDiff > maxDiff)
               {
                  maxDiff = (byte)localDiff;
                  maxDiffIndex = i;
               }
            }
         }
         if (maxDiffIndex > -1)
            return new Tuple<int, ushort>(maxDiffIndex, maxDiff);
         return null;
      }
   }
}
