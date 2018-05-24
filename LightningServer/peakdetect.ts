declare const Buffer;
export module peakdetect {
   export function calcpeak(buffer, lag, threshold) {
      var signal = Buffer.alloc(buffer.length);
      //move through buffer, looking last lag
      for (var i = 0; i < buffer.length; i++) {
         var laglhs = math.max(0, i - lag);
         var lagrhs = i;
         if (i > lag) {
            var window = buffer.splice(laglhs, i - laglhs);
            var windowavg = math.mean(window);
            var windowstddev = math.std(window);
            if (windowstddev > threshold) {
               signal[i]=1;
            } 
         }
      }
      return signal;
   }
}