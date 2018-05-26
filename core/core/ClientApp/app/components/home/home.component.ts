import { Component } from '@angular/core';

@Component({
   selector: 'home',
   templateUrl: './home.component.html'
})

export class HomeComponent {
   title: string = 'My first AGM project';
   lat: number = 51.678418;
   lng: number = 7.809007;
}