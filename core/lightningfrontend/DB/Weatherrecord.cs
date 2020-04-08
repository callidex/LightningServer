namespace lightningfrontend.DB
{
   public partial class Weatherrecord
    {
        public long Id { get; set; }
        public ulong Detectoruid { get; set; }
        public ulong Received { get; set; }
        public decimal? Humidity { get; set; }
        public decimal? Temp { get; set; }
    }
}
