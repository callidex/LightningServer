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
