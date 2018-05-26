import { Component } from '@angular/core';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['map.component.css']
})

export class MapComponent {
    title: string = 'Detectors';
    lat: number = 51.678418;
    lng: number = 7.809007;
}