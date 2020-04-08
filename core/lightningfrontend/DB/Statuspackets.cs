namespace lightningfrontend.DB
{
   public partial class Statuspackets
   {
      public long Id { get; set; }
      public string Address { get; set; }
      public int? Avgadcnoise { get; set; }
      public int? Batchid { get; set; }
      public long? Clocktrim { get; set; }
      public uint Detectoruid { get; set; }
      public int? Gpsday { get; set; }
      public int? Gpsfixtype { get; set; }
      public int? Gpsflags { get; set; }
      public int? Gpsgspeed { get; set; }
      public long? Gpshacc { get; set; }
      public long? Gpshmsl { get; set; }
      public int? Gpsheading { get; set; }
      public int? Gpsheadingacc { get; set; }
      public int? Gpsheight { get; set; }
      public int? Gpshour { get; set; }
      public long? Gpsitow { get; set; }
      public float? Gpslat { get; set; }
      public float? Gpslon { get; set; }
      public int? Gpsmin { get; set; }
      public int? Gpsmonth { get; set; }
      public long? Gpsnano { get; set; }
      public int? Gpsnumsv { get; set; }
      public long? Gpspdop { get; set; }
      public int? Gpsres1 { get; set; }
      public int? Gpsres2 { get; set; }
      public int? Gpsres3 { get; set; }
      public long? Gpssacc { get; set; }
      public int? Gpssec { get; set; }
      public long? Gpstacc { get; set; }
      public long? Gpsvacc { get; set; }
      public int? Gpsvalid { get; set; }
      public long? Gpsveld { get; set; }
      public long? Gpsvele { get; set; }
      public long? Gpsveln { get; set; }
      public int? Gpsyear { get; set; }
      public long? Gpsuptime { get; set; }
      public string Rawpacketid { get; set; }
      public int? Majorversion { get; set; }
      public int? Minorversion { get; set; }
      public int? Netuptime { get; set; }
      public int? Packetnumber { get; set; }
      public int? Packetssent { get; set; }
      public int? Packettype { get; set; }
      public long? Persisteddate { get; set; }
      public long? Received { get; set; }
      public int? Sysuptime { get; set; }
      public int? Triggernoise { get; set; }
      public int? Triggeroffset { get; set; }
      public float? Version { get; set; }
   }
}
