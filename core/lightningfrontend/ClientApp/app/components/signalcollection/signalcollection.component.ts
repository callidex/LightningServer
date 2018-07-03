import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISignal } from '../../utils/utils';

@Component({
    selector: 'app-signal-collection',
    templateUrl: './signalcollection.component.html',
    styleUrls: ['./signalcollection.component.css']
})

export class SignalCollectionComponent {

    signals: ISignal[] = [];

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {

        httpClient.get<ISignal[]>(baseUrl + 'api/SampleData/Signals').subscribe(result => {
            this.signals = result;
        }, error => {
            console.log(error);
        });
    }
}
