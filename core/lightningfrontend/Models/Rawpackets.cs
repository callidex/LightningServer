using System;
using System.Collections.Generic;

namespace core
{
    public partial class Rawpackets
    {
        public long Id { get; set; }
        public string Address { get; set; }
        public byte[] Data { get; set; }
        public string Port { get; set; }
        public bool? Processed { get; set; }
        public string Received { get; set; }
        public long? Timestamp { get; set; }
        public string Type { get; set; }
        public string Version { get; set; }
    }
}
