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
  Pressure: any;
  Temperature: any;

  getPressure() {
    // tslint:disable-next-line: no-bitwise
    return ((this.temppress & 0xFFFFF) / 4).toString();
  }

  getTemperature() {
    // tslint:disable-next-line: no-bitwise
    return ((this.temppress >>> 20) / 16).toString();
  }

  constructor(detector: Detector) {
    // This is the explicit version of the constructor.
    // populates the real object from a shallow JS version over the wire
    Object.assign(this, detector);
    // and we can call functions on this real one
    this.Pressure = this.getPressure();
    this.Temperature = this.getTemperature();
  }

}
