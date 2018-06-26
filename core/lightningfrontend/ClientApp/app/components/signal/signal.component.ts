import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Chart, ChartData, Point } from 'chart.js';

@Component({
    selector: 'app-signal',
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.css']
})

export class SignalComponent {

    public chart: Chart = new Chart('canvas', {});

    public labels: string[] = new Array();
    public signals: number[][] | undefined;

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {

        httpClient.get<number[][]>(baseUrl + 'api/SampleData/Signals').subscribe(result => {
            this.signals = result;
            var i: number = 0;
            console.log(this.signals);
            this.signals[0].forEach(() => { this.labels.push(i.toString()); i++; });

            this.chart = new Chart('canvas', {
                type: 'line',
                data: {
                    labels: this.labels,
                    datasets: [
                        {
                            data: this.signals[0],
                            borderColor: "#3cba9f",
                            fill: false
                        }
                        //    {
                        //        data: this.signals,
                        //        borderColor: "#ffcc00",
                        //        fill: false
                        //    },
                    ]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            display: true

                        }],
                        yAxes: [{
                            display: true
                            , ticks:
                                {
                                    min: 0, max: 4000
                                }

                        }],
                    }
                }
            });
        });
    }
}

interface ISignal {
    Data: number[]
}