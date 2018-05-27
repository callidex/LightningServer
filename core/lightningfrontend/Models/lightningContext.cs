using System;
using lightningContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace lightningfrontend
{
    public partial class lightningContext : DbContext
    {
        public virtual DbSet<Datapackets> Datapackets { get; set; }
        public virtual DbSet<Rawpackets> Rawpackets { get; set; }
        public virtual DbSet<Statuspackets> Statuspackets { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("server=s7.slashdit.com;port=3306;user=mapping;password=mappingpwd;database=lightning");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Datapackets>(entity =>
            {
                entity.ToTable("datapackets");

                entity.HasIndex(e => e.Id)
                    .HasName("iddatapackets_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Adcseq)
                    .HasColumnName("adcseq")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasColumnName("address")
                    .HasMaxLength(45);

                entity.Property(e => e.Batchid)
                    .HasColumnName("batchid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Clocktrim)
                    .HasColumnName("clocktrim")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Data)
                    .IsRequired()
                    .HasColumnName("data")
                    .HasColumnType("blob");

                entity.Property(e => e.Detectoruid)
                    .HasColumnName("detectoruid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Dmatime)
                    .HasColumnName("dmatime")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Firstsampletimestamp).HasColumnName("firstsampletimestamp");

                entity.Property(e => e.Maxval)
                    .HasColumnName("maxval")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Mean).HasColumnName("mean");

                entity.Property(e => e.Needsprocessing)
                    .HasColumnName("needsprocessing")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Packetnumber)
                    .HasColumnName("packetnumber")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Packettype)
                    .HasColumnName("packettype")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Persisteddate)
                    .HasColumnName("persisteddate")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Rawpacketid)
                    .HasColumnName("rawpacketid")
                    .HasMaxLength(45);

                entity.Property(e => e.Received)
                    .HasColumnName("received")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Rtsecs)
                    .HasColumnName("rtsecs")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Signalcnt)
                    .HasColumnName("signalcnt")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Signaldata)
                    .HasColumnName("signaldata")
                    .HasColumnType("blob");

                entity.Property(e => e.StatusFk)
                    .HasColumnName("status_fk")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Stddev).HasColumnName("stddev");

                entity.Property(e => e.Udpnumber)
                    .HasColumnName("udpnumber")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Variance).HasColumnName("variance");

                entity.Property(e => e.Version).HasColumnName("version");
            });

            modelBuilder.Entity<Rawpackets>(entity =>
            {
                entity.ToTable("rawpackets");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Address)
                    .HasColumnName("address")
                    .HasMaxLength(45);

                entity.Property(e => e.Data)
                    .IsRequired()
                    .HasColumnName("data")
                    .HasMaxLength(1500);

                entity.Property(e => e.Port)
                    .HasColumnName("port")
                    .HasMaxLength(45);

                entity.Property(e => e.Processed)
                    .HasColumnName("processed")
                    .HasColumnType("bit(1)");

                entity.Property(e => e.Received)
                    .HasColumnName("received")
                    .HasMaxLength(100);

                entity.Property(e => e.Timestamp)
                    .HasColumnName("timestamp")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Type)
                    .HasColumnName("type")
                    .HasMaxLength(45);

                entity.Property(e => e.Version)
                    .HasColumnName("version")
                    .HasMaxLength(45);
            });

            modelBuilder.Entity<Statuspackets>(entity =>
            {
                entity.ToTable("statuspackets");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Address)
                    .HasColumnName("address")
                    .HasMaxLength(45);

                entity.Property(e => e.Avgadcnoise)
                    .HasColumnName("avgadcnoise")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Batchid)
                    .HasColumnName("batchid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Clocktrim)
                    .HasColumnName("clocktrim")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Detectoruid)
                    .HasColumnName("detectoruid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsday)
                    .HasColumnName("gpsday")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsfixtype)
                    .HasColumnName("gpsfixtype")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsflags)
                    .HasColumnName("gpsflags")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsgspeed)
                    .HasColumnName("gpsgspeed")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpshacc)
                    .HasColumnName("gpshacc")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsheading)
                    .HasColumnName("gpsheading")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsheadingacc)
                    .HasColumnName("gpsheadingacc")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsheight)
                    .HasColumnName("gpsheight")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpshmsl)
                    .HasColumnName("gpshmsl")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpshour)
                    .HasColumnName("gpshour")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsitow)
                    .HasColumnName("gpsitow")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpslat).HasColumnName("gpslat");

                entity.Property(e => e.Gpslon).HasColumnName("gpslon");

                entity.Property(e => e.Gpsmin)
                    .HasColumnName("gpsmin")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsmonth)
                    .HasColumnName("gpsmonth")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsnano)
                    .HasColumnName("gpsnano")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsnumsv)
                    .HasColumnName("gpsnumsv")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpspdop)
                    .HasColumnName("gpspdop")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsres1)
                    .HasColumnName("gpsres1")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsres2)
                    .HasColumnName("gpsres2")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsres3)
                    .HasColumnName("gpsres3")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpssacc)
                    .HasColumnName("gpssacc")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpssec)
                    .HasColumnName("gpssec")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpstacc)
                    .HasColumnName("gpstacc")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsuptime)
                    .HasColumnName("gpsuptime")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsvacc)
                    .HasColumnName("gpsvacc")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsvalid)
                    .HasColumnName("gpsvalid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Gpsveld)
                    .HasColumnName("gpsveld")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsvele)
                    .HasColumnName("gpsvele")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsveln)
                    .HasColumnName("gpsveln")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Gpsyear)
                    .HasColumnName("gpsyear")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Majorversion)
                    .HasColumnName("majorversion")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Minorversion)
                    .HasColumnName("minorversion")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Netuptime)
                    .HasColumnName("netuptime")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Packetnumber)
                    .HasColumnName("packetnumber")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Packetssent)
                    .HasColumnName("packetssent")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Packettype)
                    .HasColumnName("packettype")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Persisteddate)
                    .HasColumnName("persisteddate")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Rawpacketid)
                    .HasColumnName("rawpacketid")
                    .HasMaxLength(45);

                entity.Property(e => e.Received)
                    .HasColumnName("received")
                    .HasColumnType("bigint(20)");

                entity.Property(e => e.Sysuptime)
                    .HasColumnName("sysuptime")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Triggernoise)
                    .HasColumnName("triggernoise")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Triggeroffset)
                    .HasColumnName("triggeroffset")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Version).HasColumnName("version");
            });
        }
    }
}
