'use strict';
var math = require('mathjs');
module.exports = {
    calcpeak: function (buffer, lag, threshold, inf) {

        var stddev = math.std(buffer);
        var signal = [];
        for (var i = 0; i < buffer.length; i++) {
            if (i <= lag) {
                signal.push(0);
            }
            else {
                var window = buffer.slice(i -lag, i);
                if (window.length > 0) {
                    var windowavg = math.mean(window);
                    var windowstddev = math.std(window);
                    if (windowstddev > stddev) {
                        signal.push(1);
                        // flag a signal at the highest point in the window
                        for (var j = 0; j < window.length; j++)
                        {
                            if (window[j] == math.max(window)) {
                                signal[i - lag + j] = 1;
                            }
                        }
                    }
                    else { signal.push(0); }
                } else { signal.push(0); }
            }
        }
        return signal;
    }
}
