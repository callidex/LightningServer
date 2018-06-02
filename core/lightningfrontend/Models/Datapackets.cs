﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;

namespace lightningContext
{
    public partial class Datapacket
    {
        public Datapacket(byte[] rawBytes)
        {
            //TODO: break out the bytes from the new format
            Adcseq = BitConverter.ToInt32(rawBytes, 20);


            _isReady = true;
        }
        public bool IsReady() => _isReady;

        private bool _isReady;

        /* Do not edit below, generated from database structure*/


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
    }
}
