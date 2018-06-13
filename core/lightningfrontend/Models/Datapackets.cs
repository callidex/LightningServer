using System;
using System.Runtime.InteropServices;

namespace lightningContext
{

    public partial class Datapacket
    {
        [StructLayout(LayoutKind.Sequential, Pack = 2)]
        public unsafe struct Datapkt
        {

            public UInt32 udpcount;      // udp packet sent index (24 bits, other 8 bits are packet type)
            public byte buffnum_pps;    // first 2 bits are adc buffer number
            public byte adcseq;
            public UInt16 detectorId;
            public UInt32 epoch;
            public fixed UInt16 data[728];

        }
        public Datapacket(byte[] rawBytes)
        {
            IntPtr intPtr = Marshal.AllocHGlobal(rawBytes.Length);
            Marshal.Copy(rawBytes, 0, intPtr, rawBytes.Length);
            Datapkt s = (Datapkt)Marshal.PtrToStructure(intPtr, typeof(Datapkt));
            Marshal.FreeHGlobal(intPtr);
            Batchid = s.adcseq;
            Packetnumber = (int?)s.udpcount;
            Detectoruid = s.detectorId;
            Epoch = s.epoch;

            unsafe
            {
                // Pin the buffer to a fixed location in memory.
                // Access safely through the index:
                for (int i = 0; i < 728; i++)
                {
                    data[i] = s.data[i];
                }
            }
            Data = new byte[data.Length * sizeof(UInt16)];
            Buffer.BlockCopy(data, 0, Data, 0, data.Length);
            _isReady = true;
        }
        public bool IsReady() => _isReady;

        private bool _isReady;

        /* Do not edit below, generated from database structure*/

        public UInt16[] data = new UInt16[728];

        public long Id { get; set; }
        public int? Adcseq { get; set; }


        public string Address { get; set; }
        public int Batchid { get; set; }
        public long? Clocktrim { get; set; }
        public byte[] Data { get; set; }
        public int Detectoruid { get; set; }
        public long? Dmatime { get; set; }
        public float? Firstsampletimestamp { get; set; }
        public long? StatusFk { get; set; }
        public string Rawpacketid { get; set; }
        public int? Maxval { get; set; }
        public float? Mean { get; set; }
        public int? Needsprocessing { get; set; }
        public int? Packetnumber { get; set; }
        public int? Packettype { get; set; }
        public long? Persisteddate { get; set; }
        public long? Received { get; set; }
        public int? Rtsecs { get; set; }
        public byte[] Signaldata { get; set; }
        public int? Signalcnt { get; set; }
        public float? Stddev { get; set; }
        public int? Udpnumber { get; set; }
        public float? Variance { get; set; }
        public float? Version { get; set; }
        public UInt32 Epoch;

    }
}
