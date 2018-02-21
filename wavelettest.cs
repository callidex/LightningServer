            BinaryReader reader = new BinaryReader(fs);

            List<double> readInData = new List<double>();
            byte[] arr = reader.ReadBytes(2);
            while (arr.Count()>0)
            {
               readInData.Add(arr[0] | arr[1] << 8);
               arr = reader.ReadBytes(2);
            }



            var signal = new Signal(readInData.ToArray(),2680000);
            var wavelet = MotherWavelet.LoadFromName("haar");
            var output = DWT.ExecuteDWT(signal, wavelet, 2);
            
            
            
            
            
  public class Signal
    {
        /// <summary>
        /// Name of the signal
        /// </summary>
        public string Name { get; set; }

        private double[] _samples;
        /// <summary>
        /// Samples of the signal
        /// </summary>
        public double[] Samples
        {
            get
            {
                return _samples;
            }
            set
            {
                if (_samples != null && value != null)
                {
                    SamplingInterval *= Convert.ToDouble(_samples.Length) / value.Length;
                    if (IsComplex)
                        SamplingInterval *= 2;
                }                
                _samples = value;
            }
        }

        /// <summary>
        /// Returns the value of the sample in the specified index
        /// </summary>        
        /// <exception cref="IndexOutOfRangeException">Throws System.IndexOutOfRangeException if specified index is less than 0 or equals or greater than the number of samples in the signal.</exception>
        public double this[int index]
        {
            get { return _samples[index]; }
            set { _samples[index] = value; }
        }
        
        /// <summary>
        /// Gets the number of samples in the signal
        /// </summary>
        public int SamplesCount 
        {
            get { return _samples != null ? _samples.Length : 0; }
        }

        /// <summary>
        /// Complex samples of the signal
        /// </summary>
        public bool IsComplex { get; set; }

        /// <summary>
        /// Start of the signal in the time
        /// </summary>
        public double Start { get; set; }

        /// <summary>
        /// Finish od the signal in the time
        /// </summary>
        public double Finish { get; set; }

        private double _samplingInterval;
        /// <summary>
        /// Gets or sets  the interval of samples (1/SamplingRate)
        /// </summary>
        /// <returns></returns>
        public double SamplingInterval
        {
            get
            {
                return _samplingInterval;
            }
            set
            {
                _samplingInterval = value;
                if (Math.Abs(value - 0d) > double.Epsilon)
                {
                    _samplingRate = Convert.ToInt32(Math.Round(1 / value));
                }
            }
        }

        private int _samplingRate;
        /// <summary>
        /// Sampling rate used on sampling
        /// </summary>
        public int SamplingRate
        {
            get
            {
                return _samplingRate;
            }
            set
            {
                _samplingRate = value;
                if (value == 0)
                    _samplingInterval = 1;
                else
                    _samplingInterval = 1d / value;
            }
        }

        /// <summary>
        /// Custom plotting
        /// </summary>
        public double[] CustomPlot { get; set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public Signal()
        {
            Samples = new double[0];
            SamplingRate = 1;
        }

        /// <summary>
        /// Aditional constructor, passing an array of double with the samples of the signal
        /// </summary>
        /// <param name="samples">The samples of the signal</param>
        public Signal(params double[] samples)
        {
            Samples = samples;
            SamplingRate = 1;
        }

        /// <summary>
        /// Aditional constructor, passing an array of double with the samples of the signal and the number of samples per second
        /// </summary>
        /// <param name="samples">The samples of the signal</param>
        /// <param name="samplesPerSecond">Quantity of samples per second</param>
        public Signal(double[] samples, int samplesPerSecond)
        {
            Samples = samples;
            SamplingRate = samplesPerSecond;
        }

        /// <summary>
        /// Informs that size of signal is a power of 2.
        /// </summary>
        /// <returns></returns>
        public bool LengthIsPowerOf2()
        {
            return WaveMath.IsPowerOf2(Samples.Length);
        }

        /// <summary>
        /// Resizes the signal until its length be a power of 2.
        /// </summary>
        /// <returns></returns>
        public void MakeLengthPowerOfTwo()
        {
            if (LengthIsPowerOf2() || Samples.Length == 0)
            {
                return;
            }
            var length = Samples.Length;
            while (!(WaveMath.IsPowerOf2(length)) && length > 0)
            {
                length--;
            }
            var newArray = MemoryPool.Pool.New<double>(length);
            Array.Copy(Samples, newArray, length);
            Samples = newArray;
        }       

        /// <summary>
        /// Gets all the samples of the signal separated with a space
        /// </summary>
        /// <returns></returns>
        public new string ToString()
        {
            return ToString(3);
        }

        /// <summary>
        /// Gets all the samples of the signal separated with a space
        /// </summary>
        /// <param name="precision"></param>
        /// <returns></returns>
        public string ToString(int precision)
        {
            return ToString(precision, " ");
        }

        /// <summary>
        /// Gets all the samples of the signal separated with the separator parameter
        /// </summary>
        /// <param name="precision"></param>
        /// <param name="separator"></param>
        /// <returns></returns>
        public string ToString(int precision, string separator)
        {
            if (Samples == null)
                return "";
            var format = "{0:0.";
            for (var i = 0; i < precision; i++)
            {
                format += "0";
            }
            format += "}" + separator;
            var str = new StringBuilder();
            foreach (var t in Samples)
            {
                str.Append(string.Format(System.Globalization.CultureInfo.InvariantCulture, format, t));
            }
            return str.ToString().TrimEnd(separator.ToCharArray());
        }

        /// <summary>
        /// Get all the samples in a key value array pair
        /// </summary>
        /// <returns></returns>
        public IEnumerable<double[]> GetSamplesPair()
        {
            if (Samples == null || Samples.Length == 0)
            {
                return new List<double[]>();
            }
            var samples = new List<double[]>();
            var x = Start;
            foreach (var t in Samples)
            {
                samples.Add(new []{t, x});
                x = Convert.ToDouble(Convert.ToDecimal(x) + Convert.ToDecimal(SamplingInterval));
            }
            return samples;
        }

        /// <summary>
        /// Get the time series array
        /// </summary>
        /// <returns></returns>
        public double[] GetTimeSeries()
        {
            if (Samples == null || Samples.Length == 0)
            {
                return new double[0];
            }
            var t = new double[_samples.Length];
            var currentT = Convert.ToDecimal(Start);
            var interval = Convert.ToDecimal(SamplingInterval);
            for (var i = 0; i < _samples.Length; i++)
            {
                t[i] = Convert.ToDouble(currentT);
                currentT += interval;
            }            
            return t;
        }

        public int GetSampleIndexByTime(double time)
        {
            return Convert.ToInt32(WaveMath.LimitRange(Math.Floor((time - Start) / SamplingInterval), 0, SamplesCount-1));
        }

        /// <summary>
        /// Clones the signal, including the samples
        /// </summary>
        /// <returns></returns>
        public Signal Clone()
        {
            var signal = (Signal)MemberwiseClone();
            signal.Samples = (double[]) Samples.Clone();
            return signal;
        }

        /// <summary>
        /// Clone the signal without cloning the samples
        /// </summary>
        /// <returns></returns>
        public Signal Copy()
        {
            var signal = (Signal)MemberwiseClone();
            signal.Samples = null;
            return signal;
        }
    }
    
    
      public class MotherWavelet
    {
        /// <summary>
        /// Name of the mother wavelet
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The scaling function of the mother wavelet, used to calculate the filters
        /// </summary>
        public double[] ScalingFilter { get; set; }

        private FiltersStruct _filters;

        /// <summary>
        /// Constructior using the name and the scaling filter
        /// </summary>
        /// <param name="name">Name of the mother wavelet</param>
        /// <param name="scalingFilter">The scaling function of the mother wavelet</param>
        public MotherWavelet(string name, double[] scalingFilter)
        {
            Name = name;
            ScalingFilter = scalingFilter;
        }

        /// <summary>
        /// Constructior using the name and the scaling filter
        /// </summary>
        /// <param name="scalingFilter">The scaling function of the mother wavelet</param>
        public MotherWavelet(double[] scalingFilter)
        {
            ScalingFilter = scalingFilter; 
        }
        
        /// <summary>
        /// Decomposition and Reconstruction filters
        /// </summary>
        public FiltersStruct Filters
        {
            get 
            {
                if (_filters.DecompositionHighPassFilter == null)
                {
                    CalculateFilters();
                }
                return _filters; 
            }
        }

        /// <summary>
        /// Decomposition and Reconstruction filters base-type
        /// </summary>
        [Serializable]
        public struct FiltersStruct
        {
            /// <summary>
            /// Decomposition Low-pass Filter
            /// </summary>
            public double[] DecompositionLowPassFilter;
            /// <summary>
            /// Decomposition High-pass Filter
            /// </summary>
            public double[] DecompositionHighPassFilter;
            /// <summary>
            /// Reconstruction Low-pass Filter
            /// </summary>
            public double[] ReconstructionLowPassFilter;
            /// <summary>
            /// Reconstruction High-pass Filter
            /// </summary>
            public double[] ReconstructionHighPassFilter;
        }

        /// <summary>
        /// Calculates the reconstruction and decomposition filters 
        /// </summary>
        public void CalculateFilters()
        {
            var filterLength = ScalingFilter.Length;
            const double sqrt2 = 1.4142135623730951; //Math.Sqrt(2)
           

            //Calculating Lo_R
            _filters.ReconstructionLowPassFilter = MemoryPool.Pool.New<double>(filterLength);
            for (var i = 0; i < filterLength; i++)
            {
                _filters.ReconstructionLowPassFilter[i] = ScalingFilter[i] * sqrt2;
            }

            //Calculating Lo_D  (inverse of Lo_R)
            _filters.DecompositionLowPassFilter = MemoryPool.Pool.New<double>(filterLength);
            _filters.ReconstructionLowPassFilter.CopyTo(_filters.DecompositionLowPassFilter, 0);
            Array.Reverse(_filters.DecompositionLowPassFilter);

            //Calculating Hi_R (qmf(Lo_R))
            var k = 0;
            _filters.ReconstructionHighPassFilter = MemoryPool.Pool.New<double>(filterLength);
            for (var i = filterLength - 1; i >= 0; i--)
            {
                _filters.ReconstructionHighPassFilter[k] = _filters.ReconstructionLowPassFilter[i];
                if (k % 2 != 0)
                {
                    _filters.ReconstructionHighPassFilter[k] *= -1;
                }
                k++;
            }

            //Calculating Hi_D  (inverse of Hi_R)
            _filters.DecompositionHighPassFilter = MemoryPool.Pool.New<double>(filterLength);
            _filters.ReconstructionHighPassFilter.CopyTo(_filters.DecompositionHighPassFilter, 0);
            Array.Reverse(_filters.DecompositionHighPassFilter);
        }

        /// <summary>
        /// Loads the mother-wavelet by its name. Just a link to CommonMotherWavelets.GetWaveletFromName.
        /// </summary>
        /// <param name="name">Mother-wavelet name</param>
        /// <returns></returns>
        public static MotherWavelet LoadFromName(string name)
        {
            return CommonMotherWavelets.GetWaveletFromName(name);
        }
    }
     public static class DWT
    {
        /// <summary>
        /// Multilevel 1-D Discreete Wavelet Transform
        /// </summary>
        /// <param name="signal">The signal. Example: new Signal(5, 6, 7, 8, 1, 2, 3, 4)</param>
        /// <param name="motherWavelet">The mother wavelet to be used. Example: CommonMotherWavelets.GetWaveletFromName("DB4")</param>
        /// <param name="level">The depth-level to perform the DWT</param>
        /// <param name="extensionMode">Signal extension mode</param>
        /// <param name="convolutionMode">Defines what convolution function should be used</param>
        /// <returns></returns>
        public static List<DecompositionLevel> ExecuteDWT(Signal signal, MotherWavelet motherWavelet, int level, SignalExtension.ExtensionMode extensionMode = SignalExtension.ExtensionMode.SymmetricHalfPoint, ConvolutionModeEnum convolutionMode = ConvolutionModeEnum.ManagedFFT)
        {
            var levels = new List<DecompositionLevel>();

            var approximation = (double[])signal.Samples.Clone();
            var details = (double[])signal.Samples.Clone();

            var realLength = signal.Samples.Length;
            for (var i = 1; i <= level; i++)
            {
                var extensionSize = motherWavelet.Filters.DecompositionLowPassFilter.Length - 1;
                
                approximation = SignalExtension.Extend(approximation, extensionMode, extensionSize);
                details = SignalExtension.Extend(details, extensionMode, extensionSize);

                approximation = WaveMath.Convolve(convolutionMode, approximation, motherWavelet.Filters.DecompositionLowPassFilter);
                approximation = WaveMath.DownSample(approximation);

                details = WaveMath.Convolve(convolutionMode, details, motherWavelet.Filters.DecompositionHighPassFilter);
                details = WaveMath.DownSample(details);

                realLength = realLength / 2;

                levels.Add(new DecompositionLevel
                               {
                                   Signal = signal,
                                   Index = i - 1,
                                   Approximation = approximation,
                                   Details = details
                               });
                details = (double[]) approximation.Clone();
            }
            return levels;
        }
        
        /// <summary>
        /// Multilevel inverse discrete 1-D wavelet transform
        /// </summary>
        /// <param name="decompositionLevels">The decomposition levels of the DWT</param>
        /// <param name="motherWavelet">The mother wavelet to be used. Example: CommonMotherWavelets.GetWaveletFromName("DB4") </param>
        /// <param name="level">The depth-level to perform the DWT</param>
        /// <param name="convolutionMode">Defines what convolution function should be used</param>
        /// <returns></returns>
        public static double[] ExecuteIDWT(List<DecompositionLevel> decompositionLevels, MotherWavelet motherWavelet, int level = 0, ConvolutionModeEnum convolutionMode = ConvolutionModeEnum.ManagedFFT)
        {
            if (level == 0 || level > decompositionLevels.Count)
            {
                level = decompositionLevels.Count;
            }
            if (level <= 0)
                return null;
            var approximation = (double[])decompositionLevels[level-1].Approximation.Clone();
            var details = (double[]) decompositionLevels[level - 1].Details.Clone();

            for (var i = level - 1; i >= 0; i--)
            {
                approximation = WaveMath.UpSample(approximation);
                approximation = WaveMath.Convolve(convolutionMode, approximation, motherWavelet.Filters.ReconstructionLowPassFilter, true, -1);

                details = WaveMath.UpSample(details);
                details = WaveMath.Convolve(convolutionMode, details, motherWavelet.Filters.ReconstructionHighPassFilter, true, -1);

                //sum approximation with details
                approximation = WaveMath.Add(approximation, details);

                if (i <= 0) 
                    continue;
                if (approximation.Length > decompositionLevels[i-1].Details.Length)
                {
                    approximation = SignalExtension.Deextend(approximation, decompositionLevels[i - 1].Details.Length);
                }

                details = (double[]) decompositionLevels[i - 1].Details.Clone();
            }

            return approximation;
        }        
    }
    
            
