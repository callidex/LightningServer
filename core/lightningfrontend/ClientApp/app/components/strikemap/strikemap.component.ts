import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'strikemap',
    templateUrl: './strikemap.component.html',
    styleUrls: ['./strikemap.component.css']
})
export class StrikeMapComponent {
    title: string = 'Strikes';

    public strikes: IStrike[] | undefined;

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        httpClient.get<IStrike[]>(baseUrl + 'api/SampleData/Strikes').subscribe(result => {
            this.strikes = result;

        }, error => console.error(error));
    }
}

interface IStrike {
    Lat: number;
    Lon: number;
    Received: number;
}
