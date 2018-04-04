'use strict';
var math = require('mathjs');
module.exports = {
    calcpeak: function (buffer, lag, threshold, inf) {
        var signal = [];
        for (var i = 0; i < buffer.length; i++) {
            var laglhs = math.max(0, i - lag);
            var lagrhs = i;
            if (i <= lag) {
                signal.push(0);
            }

            else {
                var window = buffer.slice(laglhs, i - laglhs);
                if (window.length > 0) {
                    var windowavg = math.mean(window);
                    var windowstddev = math.std(window);
                    if (windowstddev > threshold) {
                        signal.push(1);
                    }
                    else { signal.push(0); }
                } else { signal.push(0); }
            }
        }

        return signal;
    }
}