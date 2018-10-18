namespace lightningfrontend.Models
{
    public interface IDetectionPacket
    {
        void Process(lightningfrontend.DB.lightningContext context);
        void StoreInDB(lightningfrontend.DB.lightningContext context);
    }


}
