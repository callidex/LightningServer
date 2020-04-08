using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.Numerics;

namespace lightningfrontend.Data
{
   public class DiscreteFourierTransform
   {
      /// <summary>
      /// Calculates forward Discrete Fourier Transform of given digital signal x
      /// </summary>
      /// <param name="x">Signal x samples values</param>
      /// <returns>Fourier Transform of signal x</returns>
      public Complex[] DFT(double[] x)
      {
         int N = x.Length; // Number of samples
         Complex[] X = new Complex[N];

         for (int k = 0; k < N; k++)
         {
            X[k] = 0;

            for (int n = 0; n < N; n++)
            {
               X[k] += x[n] * Complex.Exp(-Complex.ImaginaryOne * 2 * Math.PI * (k * n) / Convert.ToDouble(N));
            }

            X[k] = X[k] / N;

         }

         return X;
      }

      /// <summary>
      /// Calculates forward Discrete Fourier Transform of given digital signal x with respect to sample numbers
      /// </summary>
      /// <param name="x">Signal x samples values</param>
      /// <param name="SamplesNumbers">Samples numbers vector</param>
      /// <returns>Fourier Transform of signal x</returns>
      public Complex[] DFT(double[] x, int[] SamplesNumbers)
      {
         int N = x.Length; // Number of samples
         Complex[] X = new Complex[N];

         for (int k = 0; k < N; k++)
         {
            X[k] = 0;

            double s1 = SamplesNumbers[k];

            for (int n = 0; n < N; n++)
            {
               double s2 = SamplesNumbers[n];
               X[k] += x[n] * Complex.Exp(-Complex.ImaginaryOne * 2 * Math.PI * (s1 * s2) / Convert.ToDouble(N));
            }

            X[k] = X[k] / N;
         }
         return X;
      }

      /// <summary>
      /// Calculates forward Discrete Fourier Transform of given digital signal x with reduced number of multiplications
      /// </summary>
      /// <param name="x">Signal x samples values</param>
      /// <returns>Fourier Transform of signal x</returns>
      public Complex[] DFT2(double[] x)
      {
         int N = x.Length; // Number of samples
         Complex[] X = new Complex[N];

         // Zero-index element calculation
         X[0] = x.Sum() / N;

         for (int k = 1; k < N / 2 + 1; k++)
         {
            X[k] = 0;

            for (int n = 0; n < N; n++)
            {
               X[k] += x[n] * Complex.Exp(-Complex.ImaginaryOne * 2 * Math.PI * (k * n) / Convert.ToDouble(N));
            }

            X[k] = X[k] / N;

            // Miss additional calculation for center element
            if (k != N / 2)
            {
               X[N - k] = new Complex(X[k].Real, -X[k].Imaginary);
            }
         }

         return X;
      }

      /// <summary>
      /// Calculates forward Discrete Fourier Transform of given digital signal x with respect to sample numbers and reduced number of multiplications
      /// </summary>
      /// <param name="x">Signal x samples values</param>
      /// <param name="SamplesNumbers">Samples numbers vector</param>
      /// <returns>Fourier Transform of signal x</returns>
      public Complex[] DFT2(double[] x, int[] SamplesNumbers)
      {
         int N = x.Length; // Number of samples
         Complex[] X = new Complex[N];

         for (int k = 0; k < N / 2 + 1; k++)
         {
            X[k] = 0;
            double s1 = SamplesNumbers[k];

            for (int n = 0; n < N; n++)
            {
               double s2 = SamplesNumbers[n];
               X[k] += x[n] * Complex.Exp(-Complex.ImaginaryOne * 2 * Math.PI * (s1 * s2) / Convert.ToDouble(N));
            }

            X[k] = X[k] / N;

            // Miss additional calculation for center element
            if (k != N / 2)
            {
               X[N - k - 1] = new Complex(X[k].Real, -X[k].Imaginary);
            }
         }

         return X;
      }

      /// <summary>
      /// Calculates inverse Discrete Fourier Transform of given spectrum X
      /// </summary>
      /// <param name="X">Spectrum complex values</param>
      /// <returns>Signal samples in time domain</returns>
      public double[] IDFT(Complex[] X)
      {
         int N = X.Length; // Number of spectrum elements
         double[] x = new double[N];

         for (int n = 0; n < N; n++)
         {
            Complex sum = 0;

            for (int k = 0; k < N; k++)
            {
               sum += X[k] * Complex.Exp(Complex.ImaginaryOne * 2 * Math.PI * (k * n) / Convert.ToDouble(N));
            }

            x[n] = sum.Real; // As a result we expect only real values (if our calculations are correct imaginary values should be equal or close to zero)
         }

         return x;
      }

      /// <summary>
      /// Calculates inverse Discrete Fourier Transform of given spectrum X with respect to sample numbers
      /// </summary>
      /// <param name="X">Spectrum complex values</param>
      /// <param name="SamplesNumbers">Samples numbers vector</param>
      /// <returns>Signal samples in time domain</returns>
      public double[] IDFT(Complex[] X, int[] SamplesNumbers)
      {
         int N = X.Length; // Number of spectrum elements
         double[] x = new double[N];

         for (int n = 0; n < N; n++)
         {
            Complex sum = 0;
            double s1 = SamplesNumbers[n]; // Get sample index

            for (int k = 0; k < N; k++)
            {
               double s2 = SamplesNumbers[k];  // Get sample index
               sum += X[k] * Complex.Exp(Complex.ImaginaryOne * 2 * Math.PI * (s1 * s2) / Convert.ToDouble(N));
            }

            x[n] = sum.Real; // As a result we expect only real values (if our calculations are correct imaginary values should be equal or close to zero)
         }

         return x;
      }


      /// <summary>
      /// Calculates forward Fast Fourier Transform of given digital signal x
      /// </summary>
      /// <param name="x">Signal x samples values</param>
      /// <returns>Fourier Transform of signal x</returns>
      public Complex[] FFT(double[] x)
      {
         int N = x.Length; // Number of samples

         if (Math.Log(N, 2) % 1 != 0)
         {
            throw new Exception("Number of samples in signal must be power of 2");
         }

         Complex[] X = new Complex[N]; // Signal specturm

         // Rewrite real signal values to calculated spectrum
         for (int i = 0; i < N; i++)
         {
            X[i] = new Complex(x[i], 0);
         }

         int S = (int)Math.Log(N, 2); // Number of calculation stages

         for (int s = 1; s < S + 1; s++) // s - stage number
         {
            int BW = (int)Math.Pow(2, s - 1); // the width of butterfly
            int Blocks = (int)(Convert.ToDouble(N) / Math.Pow(2, s)); // Number of blocks in stage
            int BFlyBlocks = (int)Math.Pow(2, s - 1); // Number of butterflies in block
            int BlocksDist = (int)Math.Pow(2, s); // Distnace between blocks

            Complex W = Complex.Exp(-Complex.ImaginaryOne * 2 * Math.PI / Math.Pow(2, s)); // Fourier Transform kernel

            for (int b = 1; b < Blocks + 1; b++)
            {
               for (int m = 1; m < BFlyBlocks + 1; m++)
               {
                  int itop = (b - 1) * BlocksDist + m; // top butterfly index
                  int ibottom = itop + BW; // bottom butterfly index

                  Complex Xtop = X[itop - 1]; // top element -> X(k)
                  Complex Xbottom = X[ibottom - 1] * Complex.Pow(W, m - 1); // bottom element -> X(k + N/2)

                  // Butterfly final calculation
                  X[itop - 1] = Xtop + Xbottom;
                  X[ibottom - 1] = Xtop - Xbottom;
               }
            }
         }

         // Spectrum scaling
         for (int i = 0; i < N; i++)
         {
            X[i] = X[i] / Convert.ToDouble(N);
         }

         return X;
      }


      /// <summary>
      /// Calculates inverse Fast Fourier Transform of given spectrum
      /// </summary>
      /// <param name="X">Spectrum values</param>
      /// <returns>Signal samples</returns>
      public double[] IFFT(Complex[] X)
      {
         int N = X.Length; // Number of samples
         double[] x = new double[N];
         int E = (int)Math.Log(N, 2);

         for (int e = 1; e < E + 1; e++)
         {
            int SM = (int)Math.Pow(2, e - 1);
            int LB = (int)(Convert.ToDouble(N) / Math.Pow(2, e));
            int LMB = (int)Math.Pow(2, e - 1);
            int OMB = (int)Math.Pow(2, e);

            Complex W = Complex.Exp(Complex.ImaginaryOne * 2 * Math.PI / Math.Pow(2, e));

            for (int b = 1; b < LB + 1; b++)
            {
               for (int m = 1; m < LMB + 1; m++)
               {
                  int g = (b - 1) * OMB + m;
                  int d = g + SM;

                  Complex xgora = X[g - 1];
                  Complex xdol = X[d - 1] * Complex.Pow(W, m - 1);

                  X[g - 1] = xgora + xdol;
                  X[d - 1] = xgora - xdol;
               }
            }
         }

         for (int i = 0; i < N; i++)
         {
            x[i] = X[i].Real;
         }

         return x;
      }


      /// <summary>
      /// Input data sorting using bit reversal method
      /// </summary>
      /// <param name="x">Original input signal samples</param>
      /// <returns>Sorted signal samples</returns>
      public double[] FFTDataSort(double[] x)
      {
         int N = x.Length; // signal length

         if (Math.Log(N, 2) % 1 != 0)
         {
            throw new Exception("Number of samples in signal must be power of 2");
         }

         double[] y = new double[N]; // output (sorted) vector

         int BitsCount = (int)Math.Log(N, 2); // maximum number of bits in index binary representation

         for (int n = 0; n < N; n++)
         {
            string bin = Convert.ToString(n, 2).PadLeft(BitsCount, '0'); // index binary representation
            StringBuilder reflection = new StringBuilder(new string('0', bin.Length));

            for (int i = 0; i < bin.Length; i++)
            {
               reflection[bin.Length - i - 1] = bin[i]; // binary reflection
            }

            int number = Convert.ToInt32(reflection.ToString(), 2); // new index

            y[number] = x[n];

         }

         return y;

      }


      /// <summary>
      /// Input data sorting using index shift method
      /// </summary>
      /// <param name="x">Original input signal samples</param>
      /// <returns>Sorted signal samples</returns>
      public double[] FFTDataSort2(double[] x)
      {
         int N = x.Length; // signal length

         if (Math.Log(N, 2) % 1 != 0)
         {
            throw new Exception("Number of samples in signal must be power of 2");
         }

         int m = 1; // original index

         for (int n = 0; n < N - 1; n++) // n - new index
         {
            if (n < m)
            {
               double T = x[m - 1];
               x[m - 1] = x[n];
               x[n] = T;
            }

            int s = N / 2; // shift operator

            while (s < m)
            {
               m = m - s;
               s = s / 2;
            }

            m = m + s;
         }

         return x;

      }

      /// <summary>
      /// Input data sorting using bit reversal method
      /// </summary>
      /// <param name="X">Original input spectrum</param>
      /// <returns>Sorted spectrum</returns>
      public Complex[] FFTDataSort(Complex[] X)
      {
         int N = X.Length; // signal length

         if (Math.Log(N, 2) % 1 != 0)
         {
            throw new Exception("Number of samples in signal must be power of 2");
         }

         Complex[] y = new Complex[N]; // output (sorted) vector

         int BitsCount = (int)Math.Log(N, 2); // maximum number of bits in index binary representation

         for (int n = 0; n < N; n++)
         {
            string bin = Convert.ToString(n, 2).PadLeft(BitsCount, '0'); // index binary representation
            StringBuilder reflection = new StringBuilder(new string('0', bin.Length));

            for (int i = 0; i < bin.Length; i++)
            {
               reflection[bin.Length - i - 1] = bin[i]; // binary reflection
            }

            int number = Convert.ToInt32(reflection.ToString(), 2); // new index

            y[number] = X[n];

         }

         return y;

      }

      /// <summary>
      /// Input data sorting using index shift method
      /// </summary>
      /// <param name="X">Original input spectrum</param>
      /// <returns>Sorted spectrum</returns>
      public Complex[] FFTDataSort2(Complex[] X)
      {
         int N = X.Length;
         int a = 1;

         for (int b = 0; b < N - 1; b++)
         {
            if (b < a)
            {
               Complex T = X[a - 1];
               X[a - 1] = X[b];
               X[b] = T;
            }

            int c = N / 2;

            while (c < a)
            {
               a = a - c;
               c = c / 2;
            }

            a = a + c;
         }

         return X;

      }

      /// <summary>
      /// Complements (right) signal vector to the nearest power of 2 
      /// </summary>
      /// <param name="x">Signal samples</param>
      /// <returns>Complemented signal</returns>
      public double[] SignalPackRight(double[] x)
      {
         int M = x.Length;

         int n = (int)Math.Ceiling(Math.Log(M, 2));

         int N = (int)Math.Pow(2, n);

         if (M == N)
         {
            return x;
         }
         else
         {
            double[] y = new double[N];

            int i = 0;

            for (i = 0; i < M; i++)
            {
               y[i] = x[i];
            }

            return y;
         }
      }

      /// <summary>
      /// Complements (left) signal vector to the nearest power of 2 
      /// </summary>
      /// <param name="x">Signal samples</param>
      /// <returns>Complemented signal</returns>
      public double[] SignalPackLeft(double[] x)
      {
         int M = x.Length;

         int n = (int)Math.Ceiling(Math.Log(M, 2));

         int N = (int)Math.Pow(2, n);

         if (M == N)
         {
            return x;
         }
         else
         {
            int d = N - M;

            double[] y = new double[N];

            for (int i = d; i < N; i++)
            {
               y[i] = x[i - d];
            }

            return y;
         }
      }

      /// <summary>
      /// Complements (both sides) signal vector to the nearest power of 2 
      /// </summary>
      /// <param name="x">Signal samples</param>
      /// <returns>Complemented signal</returns>
      public double[] SignalPackBoth(double[] x)
      {
         int M = x.Length;

         int n = (int)Math.Ceiling(Math.Log(M, 2));

         int N = (int)Math.Pow(2, n);

         if (M == N)
         {
            return x;
         }
         else
         {
            int d = (int)(N - M) / 2;

            double[] y = new double[N];

            for (int i = d; i < M + d; i++)
            {
               y[i] = x[i - d];
            }

            return y;
         }
      }

      /// <summary>
      /// Shifts spectrum by changing original signal before Fourier Transform
      /// </summary>
      /// <param name="x">Original signal</param>
      /// <returns>Shifted signal</returns>
      public double[] Shift(double[] x)
      {
         int N = x.Length;

         for (int i = 0; i < N; i++)
         {
            x[i] = (int)Math.Pow(-1, i) * x[i];
         }

         return x;
      }

      /// <summary>
      /// Returns amplitudes of spectrum
      /// </summary>
      /// <param name="X">Spectrum</param>
      /// <returns>Ampolitudes</returns>
      public double[] Amplitude(Complex[] X)
      {
         double[] M = new double[X.Length];

         for (int i = 0; i < M.Length; i++)
         {
            M[i] = X[i].Magnitude;
         }

         return M;

      }


   }

}

