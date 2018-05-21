'use strict';
var math = require('mathjs');
module.exports = {
    calcpeak: function (buffer, lag) {
        var maxstddev = 0;

        var tbuf = buffer.filter(Boolean);
        var avg = math.mean(tbuf);
        tbuf = tbuf.map(function (item, index) {
            return item - avg;
        });
        var stddev = math.std(tbuf);
        var signal = new Uint16Array(buffer.length);
        for (var i = lag; i < tbuf.length; i++) {
            var window = tbuf.slice(i - lag, i);
            if (window.length > 0) {
                var windowavg = math.mean(window);

                var windowstddev = math.std(window);
                if (windowstddev > stddev) {
                    if (windowstddev > maxstddev) {
                        // flag a signal at the highest point in the window
                        var localmax = Math.max.apply(null, window.map(Math.abs));
                        for (var j = 0; j < window.length; j++) {
                            if (Math.abs(window[j]) == localmax) {
                                signal[i - lag + j] = 1;
                            }
                        }
                        maxstddev = windowstddev;
                    }
                }
                else {
                    maxstddev = 0;
                }

            }
        }
        return signal;
    }
}
