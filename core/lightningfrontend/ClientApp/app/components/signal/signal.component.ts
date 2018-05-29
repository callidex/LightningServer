import { Component } from '@angular/core';

@Component({
    selector: 'app-signal',
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.css']
})
export class SignalComponent {

    chart = []; // This will hold our chart info


       this.chart = new Chart('canvas', {
    type: 'line',
    data: {
        labels: weatherDates,
        datasets: [
            {
                data: temp_max,
                borderColor: "#3cba9f",
                fill: false
            },
            {
                data: temp_min,
                borderColor: "#ffcc00",
                fill: false
            },
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
            }],
        }
    }
});
}
