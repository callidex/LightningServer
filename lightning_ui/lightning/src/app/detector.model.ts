export class Detector {
    Lat: any;
    Lon: any;
    temppress: any;
    FirstSeen: any;
    LastSeen: any;
    sysuptime: any;
    majorversion: any;
    minorversion: any;
    Height: any;
    id: any;
    temp: any;
    press: any;


getPressure() {
  // tslint:disable-next-line: no-bitwise
return  (((this.temppress & 0xFFFFC) >>> 2) + ((this.temppress & 3) * 25 / 100)).toString;
}

getTemperature() {
  // tslint:disable-next-line: no-bitwise
return  ((this.temppress >>> 24) + (((this.temppress >>> 20) & 0x0f) * 625 / 100000)).toString;
}

}
