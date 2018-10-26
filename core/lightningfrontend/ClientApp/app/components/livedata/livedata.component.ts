import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
    selector: 'app-livedata',
    templateUrl: './livedata.component.html',
    styleUrls: ['./livedata.component.css']
})

export class LiveDataComponent {

    statuscount: number = 0;
    datacount: number = 0;
    datatable: number[] = [0, 0, 0, 0];
    statustable: number[] = [0,0,0,0];
    charttype = 'line';
    
    statuschartdata = {

        datasets: [
            {
                data: this.statustable,
                borderColor: "#3c0000",
                fill: false,
                cubicInterpolationMode: 'monotone'
            }
        ]
    };
    datachartdata = {

        datasets: [
            {
                data: this.datatable,
                borderColor: "#3c0000",
                fill: false,
                cubicInterpolationMode: 'monotone'
            }
        ]
    };
    chartoptions = {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
            display: false
        },
        elements: {
            point: { radius: 0 },
            line: {
                tension: 0, // disables bezier curves
            }
        },
    };


    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {

        interval(2000).subscribe(val =>
            httpClient.get<number>(baseUrl + 'api/SampleData/RealtimeStatusPacketCount').subscribe(result => {
                alert(result);
                this.datacount = result;
                this.datatable.push(result);
           
            }));

        interval(2000).subscribe(val =>
            httpClient.get<number>(baseUrl + 'api/SampleData/RealtimeDataPacketCount').subscribe(result => {
                this.statuscount = result;
                this.statustable.push(result);
                
            }));
    }
}
