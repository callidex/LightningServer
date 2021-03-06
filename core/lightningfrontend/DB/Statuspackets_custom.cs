﻿using System;
using System.Runtime.InteropServices;

namespace lightningfrontend.DB
{
   public partial class Statuspackets
   {
      /* for discussion, move the version to the beginning of the packet so we can switch.  There will be a time where there are multiple versions live do we 
      cater for that or just force upgrade to latest? */


      [StructLayout(LayoutKind.Sequential, Pack = 2)]
      public struct Statpkt
      {
         public UInt32 udpcount;      // udp packet sent index (24 bits, other 8 bits are packet type)

         public UbxGpsNavPvt gpsnavpvt;
         public struct UbxGpsNavPvt
         {
            //        Type  Name           Unit   Description (scaling)
            public UInt32 iTOW;       // ms     GPS time of week of the navigation epoch. See the description of iTOW for details.                     0
            public UInt16 year;       // y      Year UTC																			4
            public byte month;      // month  Month, range 1..12 UTC																6
            public byte day;        // d      Day of month, range 1..31 UTC														7
            public byte hour;       // h      Hour of day, range 0..23 UTC														8
            public byte min;        // min    Minute of hour, range 0..59 UTC									9
            public byte sec;        // s      Seconds of minute, range 0..60 UTC													10
            public byte valid;      // -      Validity Flags (see graphic below)										11
            public UInt32 tAcc;       // ns     Time accuracy estimate UTC													12
            public Int32 nano;       // ns     Fraction of second, range -1e9..1e9 UTC																16
            public byte fixType;    // -      GNSSfix Type, range 0..5															20
            public byte flags;      // -      Fix Status Flags (see graphic below)												21
            public byte reserved1;  // -      Reserved							22
            public byte numSV;      // -      Number of satellites used in Nav Solution					23
            public Int32 lon;        // deg    Longitude (1e-7)									24
            public Int32 lat;        // deg    Latitude (1e-7)												28
            public Int32 height;     // mm     Height above Ellipsoid																32
            public Int32 hMSL;       // mm     Height above mean sea level																		36
            public UInt32 hAcc;       // mm     Horizontal Accuracy Estimate																			40
            public UInt32 vAcc;       // mm     Vertical Accuracy Estimate																	44
            public Int32 velN;       // mm/s   NED north velocity														48
            public Int32 velE;       // mm/s   NED east velocity															52
            public Int32 velD;       // mm/s   NED down velocity															56
            public Int32 gSpeed;     // mm/s   Ground Speed (2-D)														60
            public Int32 heading;    // deg    Heading of motion 2-D (1e-5)												64
            public UInt32 sAcc;       // mm/s   Speed Accuracy Estimate													68
            public UInt32 headingAcc; // deg    Heading Accuracy Estimate (1e-5)											72
            public UInt16 pDOP;       // -      Position DOP (0.01)														76
            public Int16 reserved2;  // -      Reserved																	78
            public UInt32 reserved3;  // -      Reserved																	80
         }


         public UInt32 clktrim;       // Nominal 108MHz clock is actually this frequency
         public UInt16 uid;           // 16 bits used
         public UInt16 adcpktssent;   // Number of ADC pks sent in this trigger event
         public UInt16 adctrigoff;    // adc trigger threshold above noise
         public UInt16 adcbase;       // average background level seen by ADC
         public UInt32 sysuptime;     // number of seconds system up from boot uptime
         public UInt32 netuptime;     // number of seconds network up
         public UInt32 gpsuptime;     // number of seconds gps locked
         public byte majorversion;   // major version of STM32 detector
         public byte minorversion;   // minor version of STM32 detector
         public UInt16 adcnoise;      // adc average peak noise
         public UInt32 auxstatus1;    // spare 16 bits, jabbering 8 bits, adcbatchid 8 bits
         public UInt32 adcudpover;    // adc -> udp send overruns
         public UInt32 trigcount;     // adc trigger count
         public UInt32 udpsent;       // udp sample packets sent
         public UInt16 peaklevel;     // peak trig level
         public UInt16 jabcnt;        // jabber counter
         public UInt32 noisevar;      // noise variance
         public UInt32 epochsecs;
         public UInt32 reserved1;
         public UInt32 reserved2;
         public UInt32 telltale1;     // end of packet marker

      }

      public Statuspackets() { }
      public const int PACKET_SIZE = 160;
      public Statuspackets(byte[] rawBytes)
      {
         //     if (rawBytes.Length != PACKET_SIZE) throw new InvalidDataException($"Packet incorrect size ({rawBytes.Length})");

         IntPtr intPtr = Marshal.AllocHGlobal(rawBytes.Length);
         Marshal.Copy(rawBytes, 0, intPtr, rawBytes.Length);
         Statpkt s = (Statpkt)Marshal.PtrToStructure(intPtr, typeof(Statpkt));
         Marshal.FreeHGlobal(intPtr);

         Gpsitow = s.gpsnavpvt.iTOW;
         Gpsyear = s.gpsnavpvt.year;
         Gpsmonth = s.gpsnavpvt.month;
         Gpsday = s.gpsnavpvt.day;
         Gpshour = s.gpsnavpvt.hour;
         Gpsmin = s.gpsnavpvt.min;
         Gpssec = s.gpsnavpvt.sec;
         Gpsvalid = s.gpsnavpvt.valid;
         Gpstacc = s.gpsnavpvt.tAcc;
         Gpsnano = s.gpsnavpvt.nano;
         Gpsfixtype = s.gpsnavpvt.fixType;
         Gpsflags = s.gpsnavpvt.flags;
         Gpsres1 = s.gpsnavpvt.reserved1;
         Gpsres2 = s.gpsnavpvt.reserved2;
         Gpsres3 = (int)s.gpsnavpvt.reserved3;
         Gpsnumsv = s.gpsnavpvt.numSV;
         Gpslon = s.gpsnavpvt.lon / 1e7f;
         Gpslat = s.gpsnavpvt.lat / 1e7f;
         Gpsheight = s.gpsnavpvt.height;
         Gpshmsl = s.gpsnavpvt.hMSL;
         Gpshacc = s.gpsnavpvt.hAcc;
         Gpsvacc = s.gpsnavpvt.vAcc;
         Gpsveln = s.gpsnavpvt.velN;
         Gpsvele = s.gpsnavpvt.velE;
         Gpsveld = s.gpsnavpvt.velD;
         Gpsgspeed = s.gpsnavpvt.gSpeed;
         Gpsheading = s.gpsnavpvt.heading;
         Gpssacc = s.gpsnavpvt.sAcc;
         Gpsheadingacc = (int)s.gpsnavpvt.headingAcc;
         Gpspdop = s.gpsnavpvt.pDOP;

         Clocktrim = s.clktrim;
         Detectoruid = s.uid;
         Packetssent = (int)s.udpsent;
         Triggernoise = s.adcnoise;
         Triggeroffset = s.adctrigoff;
         Sysuptime = (int)s.sysuptime;
         Netuptime = (int)s.netuptime;
         Gpsuptime = s.gpsuptime;
         Majorversion = s.majorversion;
         Avgadcnoise = s.adcnoise;
         Batchid = (int)(s.auxstatus1 << 24);
         if (s.telltale1 == 0x00000000dec0edfe)
            _isReady = true;
      }
      public bool IsReady() => _isReady;

      private bool _isReady;

   }
}
