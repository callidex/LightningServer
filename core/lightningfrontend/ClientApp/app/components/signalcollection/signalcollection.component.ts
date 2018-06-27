import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-signal-collection',
    templateUrl: './signalcollection.component.html',
    styleUrls: ['./signalcollection.component.css']
})

export class SignalCollectionComponent {

    public signals: number[][] | undefined;

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {

        httpClient.get<number[][]>(baseUrl + 'api/SampleData/Signals').subscribe(result => {
            this.signals = result;
        });
    }
}
