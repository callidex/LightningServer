import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { ChartComponent } from 'angular2-chartjs';

@Component({
    selector: 'app-livedata',
    templateUrl: './livedata.component.html',
    styleUrls: ['./livedata.component.css']
})

export class LiveDataComponent implements AfterViewInit {

    ngAfterViewInit() { };

    @ViewChild('statuschart') statuschart: ChartComponent | any; 
    @ViewChild('datachart') datachart: ChartComponent | any; 

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {

        //interval(500).subscribe(val => this.setData(Math.random() * 100));
        //interval(500).subscribe(val => this.setStatus(Math.random() * 100));

        interval(2000).subscribe(val =>
            httpClient.get<number>(baseUrl + 'api/SampleData/RealtimeStatusPacketCount').subscribe(result => {
                this.setStatus(result);

            }));


        interval(2000).subscribe(val =>
            httpClient.get<number>(baseUrl + 'api/SampleData/RealtimeDataPacketCount').subscribe(result => {
                this.setData(result);
            }));
    }

    statuscount: number = 0;
    datacount: number = 0;
    datatable: number[] = new Array(240);
    statustable: number[] = new Array(240);
    charttype = 'line';

    statuschartdata = {
        labels: new Array(240),
        datasets: [
            {
                data: this.statustable,
                borderColor: "#3c0000",
                fill: true
               
            }
        ]
    };
    datachartdata = {
        labels: new Array(240),
        datasets: [
            {
                data: this.datatable,
                fill: true
                
            }
        ]
    };
    chartoptions = {
   
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        }, animation: {
            duration: 100, // general animation time
        },
        showLines: true,
        elements: {
            point: { radius: 3 }
           
        },
    };


    setStatus(res: number) {
        this.statuscount = res;
        this.statustable.push(this.statuscount);
        if (this.statustable.length > 240)
            this.statustable.shift()
        this.statuschartdata.datasets[0].data = this.statustable;
        this.statuschart.chart.update();
    }
    setData(res: number) {
        this.datacount = res;
        this.datatable.push(this.datacount);
        if (this.datatable.length > 240) {
            this.datatable.shift()
        }
        this.datachartdata.datasets[0].data = this.datatable;       
        this.datachart.chart.update()
    }

}
