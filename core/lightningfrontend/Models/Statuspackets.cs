using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace lightningContext
{
    public partial class Statuspacket
    {
        public const int PACKET_SIZE = 160;
        public Statuspacket(byte[] rawBytes)
        {
            if (rawBytes.Length != PACKET_SIZE) throw new InvalidDataException("Packet incorrect size");
            //TODO: break out the bytes from the new format
            //These offsets all need fixing up
            Gpsitow = BitConverter.ToInt32(rawBytes, 4);
            Gpsyear = BitConverter.ToInt16(rawBytes, 8);
            Gpsmonth = BitConverter.ToChar(rawBytes, 6);
            Gpsday = BitConverter.ToChar(rawBytes, 7);
            Gpshour = BitConverter.ToChar(rawBytes, 7);
            Gpsmin = BitConverter.ToChar(rawBytes, 7);
            Gpssec = BitConverter.ToChar(rawBytes, 7);
            Gpsvalid = BitConverter.ToChar(rawBytes, 7);
            Gpstacc = BitConverter.ToChar(rawBytes, 7);
            Gpsnano = BitConverter.ToChar(rawBytes, 7);
            Gpsfixtype = BitConverter.ToChar(rawBytes, 7);
            Gpsflags = BitConverter.ToChar(rawBytes, 7);
            Gpsres1 = BitConverter.ToChar(rawBytes, 7);
            Gpsres2 = BitConverter.ToChar(rawBytes, 7);
            Gpsres3 = BitConverter.ToChar(rawBytes, 7);
            Gpsnumsv = BitConverter.ToChar(rawBytes, 7);
            Gpslon = BitConverter.ToChar(rawBytes, 7);
            Gpslat = BitConverter.ToChar(rawBytes, 7);
            Gpsheight = BitConverter.ToChar(rawBytes, 7);
            Gpshmsl = BitConverter.ToChar(rawBytes, 7);
            Gpshacc = BitConverter.ToChar(rawBytes, 7);
            Gpsvacc = BitConverter.ToChar(rawBytes, 7);
            Gpsveln = BitConverter.ToChar(rawBytes, 7);
            Gpsvele = BitConverter.ToChar(rawBytes, 7);
            Gpsveld = BitConverter.ToChar(rawBytes, 7);
            Gpsgspeed = BitConverter.ToChar(rawBytes, 7);
            Gpsheading = BitConverter.ToChar(rawBytes, 7);
            Gpssacc = BitConverter.ToChar(rawBytes, 7);
            Gpsheadingacc = BitConverter.ToChar(rawBytes, 7);
            Gpspdop = BitConverter.ToChar(rawBytes, 7);

            Clocktrim = BitConverter.ToChar(rawBytes, 7);
            Detectoruid = BitConverter.ToChar(rawBytes, 7);
            Packetssent = BitConverter.ToChar(rawBytes, 7);
            Triggernoise = BitConverter.ToChar(rawBytes, 7);
            Triggeroffset = BitConverter.ToChar(rawBytes, 7);
            Sysuptime = BitConverter.ToChar(rawBytes, 7);
            Netuptime = BitConverter.ToChar(rawBytes, 7);
            Gpsuptime = BitConverter.ToChar(rawBytes, 7);
            Majorversion = BitConverter.ToChar(rawBytes, 7);
            Avgadcnoise = BitConverter.ToChar(rawBytes, 7);
            Batchid = BitConverter.ToChar(rawBytes, 7);

            _isReady = true;
        }
        public bool IsReady() => _isReady;

        public long Id { get; set; }
        public string Address { get; set; }
        public int? Avgadcnoise { get; set; }
        public int? Batchid { get; set; }

        private bool _isReady;

        public long? Clocktrim { get; set; }
        public int? Detectoruid { get; set; }
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
