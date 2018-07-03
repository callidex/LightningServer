import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { GeoLocationService } from '../../geo-location.service';

@Component({
    selector: 'detectormap',
    templateUrl: './detectormap.component.html',
    styleUrls: ['./detectormap.component.css']
})
export class DetectorMapComponent {
    title: string = 'Detectors';

    public detectors: IDetector[] | undefined;
    homeDetector: HomeDetector | undefined;

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        httpClient.get<IDetector[]>(baseUrl + 'api/SampleData/Detectors').subscribe(result => {
            this.detectors = result;

        }, error => console.error(error), () => navigator.geolocation.getCurrentPosition((position) => {
            this.homeDetector = new HomeDetector();
            this.homeDetector.Lat = (position.coords.latitude);
            this.homeDetector.Lon = (position.coords.longitude);
        }));
    }
}
class HomeDetector implements IDetector {
    Name: string = "You are here";
    Lat: number = 0;
    Lon: number = 0;
    Received: number = 0;
}

interface IDetector {
    Name: string;
    Lat: number;
    Lon: number;
    Received: number;
}
