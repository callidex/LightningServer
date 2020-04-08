namespace lightningfrontend.Models
{
    public interface IDetectionPacket
    {
        void Process(lightningfrontend.DB.LightningContext context);
        void StoreInDB(lightningfrontend.DB.LightningContext context);
    }


}
