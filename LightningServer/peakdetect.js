// created direct online, don't use yet :-) 

// evaluate baseline of sample (get base noise)
/* 
  roll through array 


*/



function peak(

var mean = function(array) {
  var arraySum = sum(array);
  return arraySum / array.length;
};


Convert the latitude/longitude coordinates to 3D Cartesian coordinates:

x = cos(lat) * cos(lon)
y = cos(lat) * sin(lon)
z = sin(lat)
Compute the average of x, the average of y, and the average of z:

x_avg = sum(x) / count(x)
y_avg = sum(y) / count(y)
z_avg = sum(z) / count(z)
Convert that direction back to latitude and longitude:

lat_avg = arctan(z_avg / sqrt(x_avg ** 2 + y_avg ** 2))
lon_avg = arctan(y_avg / x_avg)

module peak

  def stddev(array)
    array_mean = mean(array)
    Math.sqrt(array.reduce(0.0) { |a, b| a.to_f + ((b.to_f - array_mean) ** 2) } / array.size.to_f)
  end

  def thresholding_algo(lag: 5, threshold: 3.5, influence: 0.5)
    return nil if size < lag * 2
    Array.new(size, 0).tap do |signals|
      filtered = Array.new(self)

      initial_slice = take(lag)
      avg_filter = Array.new(lag - 1, 0.0) + [mean(initial_slice)]
      std_filter = Array.new(lag - 1, 0.0) + [stddev(initial_slice)]
      (lag..size-1).each do |idx|
        prev = idx - 1
        if (fetch(idx) - avg_filter[prev]).abs > threshold * std_filter[prev]
          signals[idx] = fetch(idx) > avg_filter[prev] ? 1 : -1
          filtered[idx] = (influence * fetch(idx)) + ((1-influence) * filtered[prev])
        end

        filtered_slice = filtered[idx-lag..prev]
        avg_filter[idx] = mean(filtered_slice)
        std_filter[idx] = stddev(filtered_slice)
      end
    end
  end
end
