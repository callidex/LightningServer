
export interface ISignal {
    data: number[];
    detector: string;
    received: number;
    receivedString: string;
    id: number;

    //    PeakValue: number;
    //    StartTime: number;
}

export interface InfoDump {
    statusPacketCount: number;
    dataPacketCount: number;
    detectorCount: number

}
