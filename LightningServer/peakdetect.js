'use strict';
var math = require('mathjs');
module.exports = {
    calcpeak: function (buffer, lag) {
        var maxstddev = 0;
        var tbuf = buffer.filter(Boolean);
        var stddev = math.std(tbuf);
        var signal = [];
        for (var i = 0; i < tbuf.length; i++) {
            if (i <= lag) {
                signal.push(0);
            }
            else {
                var window = tbuf.slice(i - lag, i);
                if (window.length > 0) {
                    var windowavg = math.mean(window);
                    var windowstddev = math.std(window);
                    if (windowstddev > stddev) {
                        if (windowstddev > maxstddev) {
                            signal.push(0);
                            // flag a signal at the highest point in the window
                            for (var j = 0; j < window.length; j++) {
                                if (window[j] == math.max(window)) {
                                    signal[i - lag + j] = 1;
                                }
                            }
                            maxstddev = windowstddev;
                        }
                    }
                    else {
                        signal.push(0);
                        maxstddev = 0;
                    }
                } else { signal.push(0); }
            }
        }
        return signal;
    }
}
