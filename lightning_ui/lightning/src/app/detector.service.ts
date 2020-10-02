import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { Detector } from './detector.model';
import { DetectorList } from './detector-list.model';
import { Strikelist } from './strikelist.model';

@Injectable({
  providedIn: 'root'
})
export class DetectorService {

  constructor(private http: HttpClient) {
  }
  getAll() {

    return this.http.get<DetectorList>(`${environment.apiUrl}:${environment.port}/detectorlist`).pipe();

  }

  getByID(id: number) {
    return this.http.get<Detector>(`${environment.apiUrl}:${environment.port}/detector/${id}`);
  }

  getStrikes(count: number) {
    return this.http.get<Strikelist>(`${environment.apiUrl}:${environment.port}/strikes/${count}`);
  }


}
