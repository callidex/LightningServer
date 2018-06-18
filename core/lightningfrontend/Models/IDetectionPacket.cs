namespace lightningfrontend.Models
{
    public interface IDetectionPacket
    {
        void Process(LightningContext context);
        void StoreInDB(LightningContext context);
    }


}
