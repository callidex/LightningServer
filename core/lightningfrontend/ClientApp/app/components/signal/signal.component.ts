import { AfterViewInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartData, Point } from 'chart.js';
import { ISignal } from '../../utils/utils';

@Component({
    selector: 'app-signal',
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.css']
})

export class SignalComponent implements AfterViewInit {

    public chart: Chart = new Chart('canvas', {});

    public labels: string[] = new Array();

    @Input()
    public signal: ISignal | any;

    @ViewChild('myCanvas') canvasRef: ElementRef | any;

    ngAfterViewInit() {
        var i: number = 0;

        if (this.signal.Data != undefined) {

            let dataArray: number[] = this.signal.Data;
            dataArray.forEach(() => { this.labels.push(i.toString()); i++; });
        }

        let ctx = this.canvasRef.nativeElement.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: [
                    {
                        data: this.signal.Data,
                        borderColor: "#3cba9f",
                        fill: false
                    }
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
    }
}