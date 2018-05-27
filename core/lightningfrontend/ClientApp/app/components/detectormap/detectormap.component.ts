import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'detectormap',
    templateUrl: './detectormap.component.html',
    styleUrls: ['./detectormap.component.css']
})

export class DetectorMapComponent {
    title: string = 'Detectors';
    lat: number = 51.678418;
    lng: number = 7.809007;

       public detectors: Detector[];

constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
  http.get(baseUrl + 'api/SampleData/Detectors').subscribe(result => {
  this.detectors = result.json() as Detector[];
  }, error => console.error(error));
   }

}
interface Detector {
    Name: string;
    Lat: number;
    Lon: number;
}
