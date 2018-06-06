using System;

namespace lightningContext
{
    public class ArrayPopper
    {
        byte[] _array;
        private int currentpos;
        private int maxpos;

        public ArrayPopper(byte[] array)
        {
            _array = array;
            currentpos = 0;
            maxpos = _array.Length;
        }
        public byte Pop()
        {
            currentpos++;
            return _array[currentpos];
        }

        public UInt16 PopUInt16()
        {
            currentpos = +2;
            return BitConverter.ToUInt16(_array, currentpos);
        }
        public Int16 PopInt16()
        {
            currentpos = +2;
            return BitConverter.ToInt16(_array, currentpos);
        }
        public Int32 PopInt32()
        {
            currentpos = +4;
            return BitConverter.ToInt32(_array, currentpos);
        }
        public UInt32 PopUInt32()
        {
            currentpos = +4;
            return BitConverter.ToUInt32(_array, currentpos);
        }
    }
}
