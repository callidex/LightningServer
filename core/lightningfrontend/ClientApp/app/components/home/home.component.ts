import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfoDump } from '../../utils/utils';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    infodump: InfoDump | undefined;
    
    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {

        httpClient.get < InfoDump>(baseUrl + 'api/SampleData/GetInfoDump').subscribe(result => {
            this.infodump = result;
        }, error => {
            console.log(error);
        });
    }

}
