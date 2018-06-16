namespace lightningfrontend.Models
{
    public interface IDetectionPacket
    {
        void Process();
        void StoreInDB();
    }


}
