import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ISignal } from '../../utils/utils';
import { ChartComponent } from 'angular2-chartjs'

@Component({
    selector: 'app-signal',
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.css']
})


export class SignalComponent {
    @Input() signal!: ISignal;

    constructor() { }

    @ViewChild(ChartComponent) chart!: ChartComponent;

    labels: string[] = new Array();

    charttype: any;
    chartdata: any;
    chartoptions: any;

    ngOnInit() {

        let i: number = 0;

        if (this.signal.data != undefined) {
            this.signal.data.forEach(() => {
                this.labels.push(i.toString()); i++;
            });
        }

        this.charttype = 'line';
        this.chartdata = {
            labels: this.labels,
            datasets: [
                {
                    data: this.signal.data,
                    borderColor: "#3cba9f",
                    fill: false,
                    cubicInterpolationMode: 'monotone'
                }
            ]
        };

        this.chartoptions = {
            legend: {
                display: false
            },
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
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
    };
}
