import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-signal',
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.css']
})

export class SignalComponent {

    public signals: ISignal[] | undefined;

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {

        httpClient.get<ISignal[]>(baseUrl + 'api/SampleData/Signals').subscribe(result => {
            this.signals = result;
        });
    }
}

interface ISignal {
    Data: number[]
}