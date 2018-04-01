var math = require('mathjs');
module.exports = {
   calcpeak: function (buffer, lag, threshold, inf) {
      var signal = [];
      //move through buffer, looking last lag
      var laglhs
      for (var i = 0; i < buffer.length; i++) {
         laglhs = math.max(0, i - lag);
         var lagrhs = i;
         if (i < lag) {
            signal.push(0);
         }

         else {
            var window = buffer.splice(laglhs, i - laglhs);
            var windowavg = math.mean(window);
            var windowstddev = math.std(window);
            if (windowstddev > threshold) {
               signal.push(1);
            } else { signal.push(0); }
         }
      }

      return signal;
   }
}