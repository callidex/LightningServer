
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
    statuspacketcount: number;
    datapacketcount: number;
    detectorcount: number

}
