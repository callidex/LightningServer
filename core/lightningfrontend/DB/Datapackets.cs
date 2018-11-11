using System;
using System.Collections.Generic;

namespace lightningfrontend.DB
{
   public partial class Datapackets
   {
      public long Id { get; set; }
      public int? Adcseq { get; set; }
      public string Address { get; set; }
      public int Batchid { get; set; }
      public long? Clocktrim { get; set; }
      public byte[] Data { get; set; }
      public uint Detectoruid { get; set; }
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
      public long Received { get; set; }
      public int? Rtsecs { get; set; }
      public byte[] Signaldata { get; set; }
      public int? Signalcnt { get; set; }
      public float? Stddev { get; set; }
      public int? Udpnumber { get; set; }
      public float? Variance { get; set; }
      public float? Version { get; set; }
   }
}
