import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'detectormap',
    templateUrl: './detectormap.component.html',
    styleUrls: ['./detectormap.component.css']
})

export class DetectorMapComponent {
    title: string = 'Detectors';

    public detectors: Detector[] | undefined;

    lat: number = 0;
    lon: number = 0;
    label: string = "";


    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        httpClient.get<Detector[]>(baseUrl + 'api/SampleData/Detectors').subscribe(result => {
            this.detectors = result;
            if (this.detectors.length > 0) {
                this.lat = this.detectors[0].Lat;
                this.lon = this.detectors[0].Lon;
                this.label = this.detectors[0].Name;
            }
        }, error => console.error(error));
    }
}

interface Detector {
    Name: string;
    Lat: number;
    Lon: number;
    Received: number;
}
