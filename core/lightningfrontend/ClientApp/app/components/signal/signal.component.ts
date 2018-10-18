import { Component, Input, ViewChild } from '@angular/core';
import { ISignal } from '../../utils/utils';
import { ChartComponent } from 'angular2-chartjs'

@Component({
    selector: 'app-signal',
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.css']
})


export class SignalComponent {
    @Input() signal!: ISignal;

    //constructor(private modalService: NgbModal) { }
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
                    borderColor: "#3c0000",
                    fill: false,
                    cubicInterpolationMode: 'monotone'
                }
            ]
        };

        this.chartoptions = {
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
            scales: {
                xAxes: [{
                    display: false

                }],
                yAxes: [{
                    display: false
                    , ticks:
                    {
                        min: 0, max: 4000
                    }

                }],
            }
        }

        //open(content) {
        //    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        //        this.closeResult = `Closed with: ${result}`;
        //    }, (reason) => {
        //        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        //    });
        //}

        //private getDismissReason(reason: any): string {
        //    if (reason === ModalDismissReasons.ESC) {
        //        return 'by pressing ESC';
        //    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        //        return 'by clicking on a backdrop';
        //    } else {
        //        return `with: ${reason}`;
        //    }
        //} 
    };

}
